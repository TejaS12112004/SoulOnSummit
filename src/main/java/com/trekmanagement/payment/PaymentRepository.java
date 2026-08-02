package com.trekmanagement.payment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Payment> findByBookingIdAndStatus(UUID bookingId, PaymentStatus status);

    @Query("SELECT p FROM Payment p JOIN p.booking b JOIN b.user u WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(p.razorpayOrderId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(b.bookingReference) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Payment> searchPayments(@Param("search") String search, Pageable pageable);
}
