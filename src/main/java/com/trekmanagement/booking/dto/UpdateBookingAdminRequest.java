package com.trekmanagement.booking.dto;

import com.trekmanagement.booking.BookingStatus;
import lombok.Data;

@Data
public class UpdateBookingAdminRequest {
    private BookingStatus status;
    private String specialRequests;
}
