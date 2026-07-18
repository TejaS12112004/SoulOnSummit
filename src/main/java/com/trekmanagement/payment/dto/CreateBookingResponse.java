package com.trekmanagement.payment.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class CreateBookingResponse {
    private UUID bookingId;
    private String bookingReference;
    private String razorpayOrderId;
    private BigDecimal amount; // For frontend checkout
    private String currency; // For frontend checkout
}
