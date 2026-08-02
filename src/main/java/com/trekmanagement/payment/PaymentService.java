package com.trekmanagement.payment;

import com.trekmanagement.booking.Booking;
import com.trekmanagement.payment.dto.VerifyPaymentRequest;
import com.trekmanagement.payment.dto.WebhookPayload;
import com.trekmanagement.payment.dto.AdminPaymentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PaymentService {

    String initializePayment(Booking booking);

    void verifyPayment(VerifyPaymentRequest request);

    void handleWebhook(WebhookPayload payload, String signature);

    Page<AdminPaymentResponse> searchAdminPayments(String search, Pageable pageable);

    void markAsPaid(UUID paymentId);

    void refundPayment(UUID paymentId);
}
