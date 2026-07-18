package com.trekmanagement.booking;

import com.trekmanagement.booking.dto.AdminBookingResponse;
import com.trekmanagement.booking.dto.BookingResponse;
import com.trekmanagement.booking.dto.BookingSummaryResponse;
import com.trekmanagement.booking.dto.CreateBookingRequest;
import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.payment.dto.CreateBookingResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.trekmanagement.common.dto.PageResponse;
import com.trekmanagement.booking.dto.AdminBookingFilterRequest;
import com.trekmanagement.booking.BookingStatus;
import com.trekmanagement.booking.dto.UpdateBookingAdminRequest;
import org.springframework.http.ResponseEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // ── Customer Endpoints ───────────────────────────────────────────────────

    @PostMapping("/bookings")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CreateBookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        return ApiResponse.success("Booking created, pending payment", bookingService.createBooking(request));
    }

    @GetMapping("/bookings")
    public ApiResponse<List<BookingSummaryResponse>> getMyBookings() {
        return ApiResponse.success("My bookings fetched successfully", bookingService.getMyBookings());
    }

    @GetMapping("/bookings/{id}")
    public ApiResponse<BookingResponse> getMyBooking(@PathVariable UUID id) {
        return ApiResponse.success("Booking fetched successfully", bookingService.getMyBooking(id));
    }

    @PostMapping("/bookings/{id}/cancel")
    public ApiResponse<Void> cancelBooking(@PathVariable UUID id) {
        bookingService.cancelBooking(id);
        return ApiResponse.success("Booking cancelled successfully", null);
    }

    // ── Admin Endpoints ──────────────────────────────────────────────────────

    @GetMapping("/admin/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all bookings (Admin) with filtering and pagination")
    public ResponseEntity<ApiResponse<PageResponse<AdminBookingResponse>>> listBookingsAdmin(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) com.trekmanagement.payment.PaymentStatus paymentStatus,
            @RequestParam(required = false) UUID departureId,
            @RequestParam(required = false) String bookingReference,
            @RequestParam(required = false) String email,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        AdminBookingFilterRequest filter = new AdminBookingFilterRequest();
        filter.setStatus(status);
        filter.setPaymentStatus(paymentStatus);
        filter.setDepartureId(departureId);
        filter.setBookingReference(bookingReference);
        filter.setEmail(email);
        filter.setSortBy(sortBy);
        filter.setSortDir(sortDir);
        filter.setPage(page);
        filter.setSize(size);

        return ResponseEntity.ok(ApiResponse.success(bookingService.searchAdminBookings(filter)));
    }

    @GetMapping("/admin/bookings/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get full booking details by ID (Admin)")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingForAdmin(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Booking fetched successfully", bookingService.getBookingForAdmin(id)));
    }

    @PatchMapping("/admin/bookings/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update booking details (Admin)")
    public ResponseEntity<ApiResponse<AdminBookingResponse>> updateBookingAdmin(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateBookingAdminRequest request) {
        
        AdminBookingResponse response = bookingService.updateBookingAdmin(id, request);
        return ResponseEntity.ok(ApiResponse.success("Booking updated successfully", response));
    }

    @PostMapping("/admin/bookings/{id}/cancel")
    public ApiResponse<Void> cancelBookingAdmin(@PathVariable UUID id) {
        bookingService.cancelBookingAdmin(id);
        return ApiResponse.success("Booking cancelled successfully", null);
    }
}
