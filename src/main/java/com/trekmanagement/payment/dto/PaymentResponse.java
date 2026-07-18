package com.trekmanagement.payment.dto;

import com.trekmanagement.payment.PaymentGateway;
import com.trekmanagement.payment.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class PaymentResponse {
    private UUID id;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private BigDecimal amount;
    private String currency;
    private String paymentMethod;
    private PaymentStatus status;
    private PaymentGateway gateway;
    private Instant paidAt;
}
