package com.trekmanagement.booking.dto;

import com.trekmanagement.booking.BookingStatus;
import com.trekmanagement.payment.PaymentStatus;
import lombok.Data;
import java.util.UUID;

@Data
public class AdminBookingFilterRequest {
    private BookingStatus status;
    private PaymentStatus paymentStatus;
    private UUID departureId;
    private String bookingReference;
    private String email;
    
    private String sortBy = "createdAt";
    private String sortDir = "desc";
    private int page = 0;
    private int size = 20;
}
