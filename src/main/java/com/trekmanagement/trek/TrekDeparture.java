package com.trekmanagement.trek;

import com.trekmanagement.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Represents a single scheduled departure of a Trek.
 *
 * All date, price, and seat fields that previously existed on Trek now live here.
 * Trek contains only static content; TrekDeparture contains the time-bound,
 * bookable instance of that content.
 *
 * Transient derived flags (isFillingFast, isSoldOut) are NOT stored here —
 * they are computed in TrekDepartureServiceImpl and returned in DepartureResponse.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
    name = "trek_departures",
    indexes = {
        @Index(name = "idx_trek_departures_trek_id",   columnList = "trek_id"),
        @Index(name = "idx_trek_departures_start_date", columnList = "start_date"),
        @Index(name = "idx_trek_departures_status",    columnList = "status"),
        @Index(name = "idx_trek_departures_trek_start", columnList = "trek_id, start_date")
    }
)
public class TrekDeparture extends BaseEntity {

    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trek_id", nullable = false)
    private Trek trek;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    /**
     * Last date on which a customer may register for this departure.
     * Must be before startDate.
     * Named registrationDeadline (not bookingCloseDate) to match trekking business terminology.
     */
    @Column(name = "registration_deadline", nullable = false)
    private LocalDate registrationDeadline;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /**
     * Optional discounted price. When present, must be <= price.
     * The effective price shown to customers is discountPrice ?? price.
     */
    @Column(name = "discount_price", precision = 10, scale = 2)
    private BigDecimal discountPrice;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    /**
     * Seats remaining for this departure.
     *
     * MUST NOT be mutated by direct entity manipulation (e.g. calling
     * setAvailableSeats(...) from arbitrary service code). The only sanctioned
     * mutation paths are:
     *   - TrekDepartureRepository.decrementAvailableSeats(id, count) / incrementAvailableSeats(id, count)
     *     — atomic, booking-related updates (reserve seats on booking, restore on cancellation).
     *   - TrekDepartureServiceImpl's own admin create/update methods, which set the
     *     initial value on creation or allow an explicit admin correction.
     * Any other code path that changes seat counts outside a booking transaction
     * risks overselling and bypasses the optimistic-locking (@Version) protection
     * this field relies on.
     */
    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    /**
     * Persisted status. Only OPEN, CANCELLED, COMPLETED are stored.
     * FILLING_FAST and SOLD_OUT are derived at read time.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private DepartureStatus status = DepartureStatus.OPEN;

    /**
     * Soft-delete flag. Inactive departures are excluded from public listing
     * and from the publishing guard check.
     */
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
}
