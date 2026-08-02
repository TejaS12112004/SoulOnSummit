package com.trekmanagement.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.trekmanagement.admin.dto.MonthlyStatProjection;

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

    List<Booking> findTop5ByOrderByBookedAtDesc();

    @Query(value = "SELECT EXTRACT(year FROM b.booked_at) as year, EXTRACT(month FROM b.booked_at) as month, " +
                   "COUNT(b.id) as count, COALESCE(SUM(b.total_amount), 0) as revenue " +
                   "FROM bookings b " +
                   "WHERE b.status IN ('CONFIRMED', 'COMPLETED') " +
                   "AND b.booked_at >= :since " +
                   "GROUP BY EXTRACT(year FROM b.booked_at), EXTRACT(month FROM b.booked_at)", nativeQuery = true)
    List<MonthlyStatProjection> getMonthlyStats(@Param("since") Instant since);

    long countByStatusIn(List<BookingStatus> statuses);

    @Query("SELECT COUNT(DISTINCT b.user.id) FROM Booking b")
    long countUniqueUsers();

    @Query("SELECT COUNT(DISTINCT b.user.id) FROM Booking b WHERE b.status = 'CONFIRMED'")
    long countUniqueConfirmedUsers();
}
