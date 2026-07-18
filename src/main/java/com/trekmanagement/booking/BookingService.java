package com.trekmanagement.booking;

import com.trekmanagement.booking.dto.AdminBookingResponse;
import com.trekmanagement.booking.dto.BookingResponse;
import com.trekmanagement.booking.dto.BookingSummaryResponse;
import com.trekmanagement.booking.dto.CreateBookingRequest;
import com.trekmanagement.booking.dto.AdminBookingFilterRequest;
import com.trekmanagement.booking.dto.UpdateBookingAdminRequest;
import com.trekmanagement.payment.dto.CreateBookingResponse;
import com.trekmanagement.common.dto.PageResponse;

import java.util.List;
import java.util.UUID;

public interface BookingService {

    CreateBookingResponse createBooking(CreateBookingRequest request);

    List<BookingSummaryResponse> getMyBookings();

    BookingResponse getMyBooking(UUID id);

    void cancelBooking(UUID id);

    // ── Admin ────────────────────────────────────────────────────────────────
    
    PageResponse<AdminBookingResponse> searchAdminBookings(AdminBookingFilterRequest filter);

    BookingResponse getBookingForAdmin(UUID id);

    AdminBookingResponse updateBookingAdmin(UUID id, UpdateBookingAdminRequest request);

    void cancelBookingAdmin(UUID id);
}
