package com.trekmanagement.booking.dto;

import com.trekmanagement.booking.BookingSource;
import com.trekmanagement.booking.BookingStatus;
import com.trekmanagement.payment.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class AdminBookingResponse {
    private UUID id;
    private String bookingReference;
    private String userEmail;
    private String userName;
    private String trekTitle;
    private LocalDate startDate;
    private BookingStatus status;
    private PaymentStatus paymentStatus;
    private BookingSource bookingSource;
    private Integer totalParticipants;
    private BigDecimal totalAmount;
    private Instant bookedAt;
}
