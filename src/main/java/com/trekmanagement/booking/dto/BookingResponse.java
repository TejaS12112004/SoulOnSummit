package com.trekmanagement.booking.dto;

import com.trekmanagement.booking.BookingSource;
import com.trekmanagement.booking.BookingStatus;
import com.trekmanagement.booking.Gender;
import com.trekmanagement.payment.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class BookingResponse {
    private UUID id;
    private String bookingReference;
    private UUID departureId;
    private String trekTitle;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private BookingStatus status;
    private PaymentStatus paymentStatus;
    private BookingSource bookingSource;
    private Integer totalParticipants;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String specialRequests;
    private Instant bookedAt;
    private Instant paymentDueAt;
    private List<ParticipantResponse> participants;
}
