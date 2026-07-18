package com.trekmanagement.booking;

import com.trekmanagement.common.BaseEntity;
import com.trekmanagement.payment.Payment;
import com.trekmanagement.payment.PaymentStatus;
import com.trekmanagement.trek.TrekDeparture;
import com.trekmanagement.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking extends BaseEntity {

    @Column(name = "booking_reference", nullable = false, unique = true, length = 30)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "departure_id", nullable = false)
    private TrekDeparture departure;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private BookingStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_source", nullable = false, length = 20)
    private BookingSource bookingSource;

    @Column(name = "total_participants", nullable = false)
    private Integer totalParticipants;

    @Column(name = "subtotal", nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "discount_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @Column(name = "booked_at", nullable = false)
    private Instant bookedAt;

    @Column(name = "payment_due_at", nullable = false)
    private Instant paymentDueAt;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    // ── Relationships ─────────────────────────────────────────────────────────

    @OneToMany(
            mappedBy = "booking",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @OrderBy("displayOrder ASC")
    private List<BookingParticipant> participants = new ArrayList<>();

    @OneToMany(
            mappedBy = "booking",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    private List<Payment> payments = new ArrayList<>();

    @Transient
    public PaymentStatus getLatestPaymentStatus() {
        if (payments == null || payments.isEmpty()) {
            return PaymentStatus.CREATED;
        }
        
        boolean hasSuccess = payments.stream().anyMatch(p -> p.getStatus() == PaymentStatus.SUCCESS);
        if (hasSuccess) {
            return PaymentStatus.SUCCESS;
        }

        return payments.stream()
                .max(java.util.Comparator.comparing(BaseEntity::getCreatedAt))
                .map(Payment::getStatus)
                .orElse(PaymentStatus.CREATED);
    }
}
