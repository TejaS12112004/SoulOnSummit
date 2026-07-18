package com.trekmanagement.booking;

import com.trekmanagement.booking.dto.AdminBookingFilterRequest;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class BookingSpecification {

    public static Specification<Booking> fromFilter(AdminBookingFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            // Note: paymentStatus is a transient property now (computed from payments).
            // Filtering by payment status purely in SQL requires joining the payments table
            // and checking the latest payment's status. For a robust production app,
            // this is usually done via a subquery or left join.
            if (filter.getPaymentStatus() != null) {
                // To filter by the latest payment status, we join the payments and check
                // This can be complex depending on schema. A simpler approach is returning
                // bookings that have AT LEAST ONE payment with this status, but for exact
                // "latest" match, it's better to add a materialised status column back or 
                // use a correlated subquery.
                // Assuming simple join for this contract (or ignored if too complex without a column):
                // For now, we will add a basic join if needed, but since it was removed from Booking, 
                // we might need a subquery. 
                // Let's implement a subquery to find the latest payment status.
                
                // Subquery: SELECT p1.status FROM Payment p1 WHERE p1.booking.id = booking.id ORDER BY p1.createdAt DESC LIMIT 1
                // Criteria API for LIMIT 1 is tricky. Another way:
                // SELECT b FROM Booking b JOIN b.payments p WHERE p.status = :status AND p.createdAt = (SELECT MAX(p2.createdAt) FROM Payment p2 WHERE p2.booking = b)
                
                jakarta.persistence.criteria.Subquery<java.time.Instant> maxDateSubquery = query.subquery(java.time.Instant.class);
                jakarta.persistence.criteria.Root<com.trekmanagement.payment.Payment> subRoot = maxDateSubquery.from(com.trekmanagement.payment.Payment.class);
                maxDateSubquery.select(cb.greatest(subRoot.<java.time.Instant>get("createdAt")));
                maxDateSubquery.where(cb.equal(subRoot.get("booking"), root));

                jakarta.persistence.criteria.Join<Booking, com.trekmanagement.payment.Payment> paymentsJoin = root.join("payments", jakarta.persistence.criteria.JoinType.INNER);
                
                predicates.add(cb.equal(paymentsJoin.get("status"), filter.getPaymentStatus()));
                predicates.add(cb.equal(paymentsJoin.get("createdAt"), maxDateSubquery));
            }

            if (filter.getDepartureId() != null) {
                predicates.add(cb.equal(root.get("departure").get("id"), filter.getDepartureId()));
            }

            if (StringUtils.hasText(filter.getBookingReference())) {
                predicates.add(cb.like(cb.lower(root.get("bookingReference")), "%" + filter.getBookingReference().toLowerCase() + "%"));
            }

            if (StringUtils.hasText(filter.getEmail())) {
                predicates.add(cb.like(cb.lower(root.get("user").get("email")), "%" + filter.getEmail().toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
