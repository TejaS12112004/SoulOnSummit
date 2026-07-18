package com.trekmanagement.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID>, JpaSpecificationExecutor<Booking> {

    Optional<Booking> findByBookingReference(String bookingReference);

    Optional<Booking> findByIdAndUserId(UUID id, UUID userId);
    
    Optional<Booking> findByBookingReferenceAndUserId(String bookingReference, UUID userId);

    List<Booking> findByUserIdOrderByBookedAtDesc(UUID userId);

    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING_PAYMENT' AND b.paymentDueAt < :now")
    List<Booking> findExpiredPendingBookings(@Param("now") Instant now);

    // ── Dashboard Aggregation Queries ───────────────────────────────────────

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.bookedAt >= :start AND b.bookedAt <= :end")
    long countBookingsBetween(@Param("start") Instant start, @Param("end") Instant end);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = 'CONFIRMED' OR b.status = 'COMPLETED'")
    java.math.BigDecimal sumTotalRevenue();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'PENDING_PAYMENT'")
    long countPendingPayments();
}
