package com.trekmanagement.booking;

import com.trekmanagement.booking.dto.*;
import com.trekmanagement.common.dto.PageResponse;
import com.trekmanagement.common.exception.ForbiddenException;
import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.notification.EmailNotificationService;
import com.trekmanagement.payment.Payment;
//import com.trekmanagement.payment.PaymentRepository;
import com.trekmanagement.payment.PaymentService;
import com.trekmanagement.payment.PaymentStatus;
import com.trekmanagement.payment.dto.CreateBookingResponse;
import com.trekmanagement.trek.TrekDeparture;
import com.trekmanagement.trek.TrekDepartureRepository;
import com.trekmanagement.user.User;
import com.trekmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final TrekDepartureRepository departureRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;
    private final BookingReferenceGenerator referenceGenerator;
    private final SeatReservationService seatReservationService;
    private final PaymentService paymentService; //
    private final EmailNotificationService notificationService;

    @Value("${app.booking.cancellation-window-hours:48}")
    private long cancellationWindowHours;

    @Override
    @Transactional
    public CreateBookingResponse createBooking(CreateBookingRequest request) {
        User currentUser = getCurrentUser();
        TrekDeparture departure = departureRepository.findById(request.getDepartureId())
                .orElseThrow(() -> new ResourceNotFoundException("Departure not found"));

        // 1. Validation
        if (!departure.isActive() || !departure.getTrek().isActive()) {
            throw new ValidationException("Trek or departure is inactive");
        }
        if (departure.getStartDate().isBefore(LocalDate.now())) {
            throw new ValidationException("Cannot book a past departure");
        }
        if (LocalDate.now().isAfter(departure.getRegistrationDeadline())) {
            throw new ValidationException("Registration is closed for this departure");
        }
        if (request.getParticipants().isEmpty()) {
            throw new ValidationException("At least one participant is required");
        }

        int count = request.getParticipants().size();

        // 2. Reserve seats (throws if insufficient)
        seatReservationService.reserve(departure.getId(), count);

        // 3. Create Booking
        Booking booking = new Booking();
        booking.setBookingReference(referenceGenerator.generate());
        booking.setUser(currentUser);
        booking.setDeparture(departure);
        booking.setStatus(BookingStatus.PENDING_PAYMENT);
        booking.setBookingSource(BookingSource.WEBSITE);
        booking.setTotalParticipants(count);

        BigDecimal price = departure.getDiscountPrice() != null ? departure.getDiscountPrice() : departure.getPrice();
        BigDecimal subtotal = price.multiply(BigDecimal.valueOf(count));
        
        booking.setSubtotal(subtotal);
        booking.setDiscountAmount(BigDecimal.ZERO);
        booking.setTotalAmount(subtotal);
        booking.setSpecialRequests(request.getSpecialRequests());
        booking.setBookedAt(Instant.now());
        booking.setPaymentDueAt(Instant.now().plus(30, ChronoUnit.MINUTES));

        // Add participants
        for (int i = 0; i < request.getParticipants().size(); i++) {
            BookingParticipantRequest pReq = request.getParticipants().get(i);
            BookingParticipant p = bookingMapper.toParticipantEntity(pReq);
            p.setBooking(booking);
            p.setDisplayOrder(i);
            booking.getParticipants().add(p);
        }

        bookingRepository.save(booking);

        // 4. Create Payment Order
        String razorpayOrderId = paymentService.initializePayment(booking);

        return CreateBookingResponse.builder()
                .bookingId(booking.getId())
                .bookingReference(booking.getBookingReference())
                .razorpayOrderId(razorpayOrderId)
                .amount(booking.getTotalAmount())
                .currency("INR") // Assuming INR here, ideally from config
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingSummaryResponse> getMyBookings() {
        UUID userId = getCurrentUserId();
        return bookingRepository.findByUserIdOrderByBookedAtDesc(userId).stream()
                .map(bookingMapper::toSummaryResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getMyBooking(UUID id) {
        UUID userId = getCurrentUserId();
        Booking booking = bookingRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return bookingMapper.toResponse(booking);
    }

    @Override
    @Transactional
    public void cancelBooking(UUID id) {
        UUID userId = getCurrentUserId();
        Booking booking = bookingRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        doCancelBooking(booking);
    }

      // ── Admin ────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AdminBookingResponse> searchAdminBookings(AdminBookingFilterRequest filter) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                org.springframework.data.domain.Sort.by(
                        org.springframework.data.domain.Sort.Direction.fromString(filter.getSortDir()),
                        filter.getSortBy()
                )
        );

        org.springframework.data.jpa.domain.Specification<Booking> spec = BookingSpecification.fromFilter(filter);
        org.springframework.data.domain.Page<Booking> page = bookingRepository.findAll(spec, pageable);

        return PageResponse.of(page.map(bookingMapper::toAdminResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingForAdmin(UUID id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return bookingMapper.toResponse(booking);
    }

    @Override
    @Transactional
    public AdminBookingResponse updateBookingAdmin(UUID id, UpdateBookingAdminRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (request.getStatus() != null) {
            // Handle releasing seats if status changed to CANCELLED and was previously reserving seats
            if (request.getStatus() == BookingStatus.CANCELLED && booking.getStatus() != BookingStatus.CANCELLED) {
                seatReservationService.release(booking.getDeparture().getId(), booking.getTotalParticipants());
                notificationService.sendCancellation(booking);
            }
            booking.setStatus(request.getStatus());
        }

        if (request.getSpecialRequests() != null) {
            booking.setSpecialRequests(request.getSpecialRequests());
        }

        Booking saved = bookingRepository.save(booking);
        return bookingMapper.toAdminResponse(saved);
    }

    @Override
    @Transactional
    public void cancelBookingAdmin(UUID id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        doCancelBooking(booking);
    }

    private void doCancelBooking(Booking booking) {
        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.EXPIRED) {
            throw new ValidationException("Booking is already " + booking.getStatus());
        }
        
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new ValidationException("Cannot cancel a completed booking");
        }

        // Check cancellation window
        Instant cancelDeadline = booking.getDeparture().getStartDate().atStartOfDay(java.time.ZoneOffset.UTC).toInstant()
                .minus(cancellationWindowHours, ChronoUnit.HOURS);
        
        if (Instant.now().isAfter(cancelDeadline)) {
            throw new ValidationException("Cancellation window has passed (less than " + cancellationWindowHours + " hours to departure)");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        seatReservationService.release(booking.getDeparture().getId(), booking.getTotalParticipants());
        
        if (booking.getLatestPaymentStatus() == PaymentStatus.SUCCESS) {
            // Initiate refund logic here (future enhancement)
            log.info("Booking {} cancelled. Refund needed.", booking.getBookingReference());
        }

        notificationService.sendCancellation(booking);
    }

    /**
     * Runs every 5 minutes (default) to expire unpaid bookings.
     */
    @Scheduled(fixedDelayString = "${app.booking.expiry-check-interval:300000}")
    @Transactional
    public void expireUnpaidBookings() {
        List<Booking> expiredBookings = bookingRepository.findExpiredPendingBookings(Instant.now());
        for (Booking booking : expiredBookings) {
            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
            seatReservationService.release(booking.getDeparture().getId(), booking.getTotalParticipants());
            log.info("Expired unpaid booking: {}", booking.getBookingReference());
        }
    }

    private UUID getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
