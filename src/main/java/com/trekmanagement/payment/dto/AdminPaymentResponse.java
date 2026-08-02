package com.trekmanagement.payment.dto;

import com.trekmanagement.payment.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class AdminPaymentResponse {
    private UUID id;
    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String paymentMethod;
    private Instant paidAt;
    
    // Derived from Booking / User / Trek
    private String bookingReference;
    private String userName;
    private String userEmail;
    private String trekTitle;
    
    // Derived from Invoice
    private String invoiceUrl;
}
