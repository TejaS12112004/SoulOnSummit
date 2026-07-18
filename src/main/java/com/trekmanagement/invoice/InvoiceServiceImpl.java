package com.trekmanagement.invoice;

import com.trekmanagement.booking.Booking;
import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.config.SupabaseConfig;
import com.trekmanagement.invoice.dto.InvoiceResponse;
import com.trekmanagement.storage.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;
    private final InvoicePdfGenerator pdfGenerator;
    private final InvoiceConfig invoiceConfig;
    private final StorageService storageService;

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoice(UUID bookingId) {
        Invoice invoice = invoiceRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found for booking: " + bookingId));
        return invoiceMapper.toResponse(invoice);
    }

    @Async("notificationExecutor")
    @Override
    @Transactional
    public void generateAndUpload(Booking booking) {
        log.info("Generating invoice for booking: {}", booking.getBookingReference());

        // Check if already exists
        if (invoiceRepository.findByBookingId(booking.getId()).isPresent()) {
            log.warn("Invoice already exists for booking: {}", booking.getBookingReference());
            return;
        }

        // Calculate GST
        BigDecimal gstRate = invoiceConfig.getGstRate();
        BigDecimal totalAmount = booking.getTotalAmount();
        BigDecimal gstMultiplier = gstRate.divide(new BigDecimal("100").add(gstRate), 4, RoundingMode.HALF_UP);
        BigDecimal gstAmount = totalAmount.multiply(gstMultiplier).setScale(2, RoundingMode.HALF_UP);

        Invoice invoice = new Invoice();
        invoice.setBooking(booking);
        invoice.setInvoiceNumber("INV-" + booking.getBookingReference().replace("SOS-", ""));
        invoice.setIssueDate(LocalDate.now());
        invoice.setTotalAmount(totalAmount);
        invoice.setGstAmount(gstAmount);

        // Generate PDF
        byte[] pdfBytes = pdfGenerator.generate(invoice, booking);

        // Upload to Supabase
        String publicUrl = storageService.uploadInvoicePdf(booking.getBookingReference(), pdfBytes).getPublicUrl();
        invoice.setInvoiceUrl(publicUrl);

        invoiceRepository.save(invoice);
        log.info("Invoice generated and uploaded for booking: {}", booking.getBookingReference());
    }
}
