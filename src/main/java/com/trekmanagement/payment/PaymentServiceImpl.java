package com.trekmanagement.payment;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.trekmanagement.booking.Booking;
import com.trekmanagement.booking.BookingRepository;
import com.trekmanagement.booking.BookingStatus;
import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.payment.dto.AdminPaymentResponse;
import com.trekmanagement.invoice.InvoiceRepository;
import com.trekmanagement.invoice.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.trekmanagement.common.exception.PaymentException;
import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.config.RazorpayConfig;
import com.trekmanagement.invoice.InvoiceService;
import com.trekmanagement.notification.EmailNotificationService;
import com.trekmanagement.payment.dto.VerifyPaymentRequest;
import com.trekmanagement.payment.dto.WebhookPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final PaymentMapper paymentMapper;
    private final RazorpayClient razorpayClient;
    private final RazorpayConfig razorpayConfig;
    private final InvoiceRepository invoiceRepository;
    private final InvoiceService invoiceService;
    private final EmailNotificationService notificationService;

    @Override
    @Transactional
    public String initializePayment(Booking booking) {
        try {
            // Amount in paise
            long amountInPaise = booking.getTotalAmount().multiply(new BigDecimal("100")).longValue();

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", razorpayConfig.getCurrency());
            orderRequest.put("receipt", booking.getBookingReference());

            Order order = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = order.get("id");

            Payment payment = new Payment();
            payment.setBooking(booking);
            payment.setRazorpayOrderId(razorpayOrderId);
            payment.setAmount(booking.getTotalAmount());
            payment.setCurrency(razorpayConfig.getCurrency());
            payment.setStatus(PaymentStatus.CREATED);
            payment.setGateway(PaymentGateway.RAZORPAY);

            paymentRepository.save(payment);
            
            log.info("Initialized payment with Razorpay order {} for booking {}", razorpayOrderId, booking.getBookingReference());
            return razorpayOrderId;

        } catch (RazorpayException e) {
            log.error("Failed to initialize Razorpay order for booking {}", booking.getBookingReference(), e);
            // We catch the error and return null. The BookingServiceImpl will save the booking
            // but return null for razorpayOrderId, allowing the user to retry later.
            return null;
        }
    }

    @Override
    @Transactional
    public void verifyPayment(VerifyPaymentRequest request) {
        log.info("Verifying payment for order {}", request.getRazorpayOrderId());
        
        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for order: " + request.getRazorpayOrderId()));

        // Idempotency check
        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            log.info("Payment for order {} is already marked as SUCCESS. Ignoring verification.", request.getRazorpayOrderId());
            return;
        }

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValid = Utils.verifyPaymentSignature(options, razorpayConfig.getKeySecret());

            if (isValid) {
                markPaymentSuccess(payment, request.getRazorpayPaymentId(), request.getRazorpaySignature());
            } else {
                payment.setStatus(PaymentStatus.FAILED);
                paymentRepository.save(payment);
                throw new PaymentException("Payment signature verification failed");
            }
        } catch (RazorpayException e) {
            log.error("Razorpay exception during signature verification", e);
            throw new PaymentException("Payment verification failed due to gateway error");
        }
    }

    @Override
    @Transactional
    public void handleWebhook(WebhookPayload payload, String signature) {
        log.info("Received Razorpay webhook event: {}", payload.getEvent());

        if (!"payment.captured".equals(payload.getEvent())) {
            log.info("Ignoring webhook event: {}", payload.getEvent());
            return;
        }

        String razorpayOrderId = payload.getPayload().getPayment().getEntity().getOrderId();
        if (razorpayOrderId == null) {
            log.warn("Webhook payload missing order_id");
            return;
        }

        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for order: " + razorpayOrderId));

        // Idempotency check
        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            log.info("Payment for order {} is already marked as SUCCESS via frontend verify. Ignoring webhook.", razorpayOrderId);
            return;
        }

        String razorpayPaymentId = payload.getPayload().getPayment().getEntity().getId();
        markPaymentSuccess(payment, razorpayPaymentId, signature); // signature here is the webhook signature, not the payment signature. We store it for audit.
    }

    private void markPaymentSuccess(Payment payment, String razorpayPaymentId, String signature) {
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(signature);
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(Instant.now());
        paymentRepository.save(payment);

        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        log.info("Payment successful. Booking {} confirmed.", booking.getBookingReference());

        // Async side effects
        invoiceService.generateAndUpload(booking);
        notificationService.sendConfirmation(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminPaymentResponse> searchAdminPayments(String search, Pageable pageable) {
        Page<Payment> payments = paymentRepository.searchPayments(search, pageable);
        return payments.map(payment -> {
            AdminPaymentResponse response = paymentMapper.toAdminResponse(payment);
            invoiceRepository.findByBookingId(payment.getBooking().getId())
                    .ifPresent(invoice -> response.setInvoiceUrl(invoice.getInvoiceUrl()));
            return response;
        });
    }

    @Override
    @Transactional
    public void markAsPaid(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new ValidationException("Payment is already successful");
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(Instant.now());
        payment.setPaymentMethod("MANUAL");
        paymentRepository.save(payment);

        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
        
        // Generate invoice if we mark as paid manually
        invoiceService.generateAndUpload(booking);
    }

    @Override
    @Transactional
    public void refundPayment(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new ValidationException("Only successful payments can be refunded");
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        paymentRepository.save(payment);
        
        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.REFUNDED);
        bookingRepository.save(booking);
    }
}
