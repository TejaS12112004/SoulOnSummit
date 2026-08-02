package com.trekmanagement.trek.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.trekmanagement.trek.DepartureStatus;
import com.trekmanagement.trek.TrekDifficulty;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Public-facing DTO for a single upcoming TrekDeparture, enriched with
 * its parent Trek's display fields.
 *
 * Used exclusively by GET /api/v1/treks/departures/upcoming.
 *
 * NEVER exposes: admin notes, booking details, customer data, unpublished trek
 * data, or internal state beyond what the public booking flow requires.
 *
 * isFillingFast and isSoldOut are derived server-side using the same
 * 30%-threshold business rule as DepartureResponse / TrekDepartureMapper.
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpcomingDepartureResponse {

    // ── Departure identity ────────────────────────────────────────────────────

    private final UUID departureId;

    // ── Parent trek display fields ────────────────────────────────────────────

    private final UUID trekId;
    private final String trekTitle;
    private final String location;
    private final String state;
    private final TrekDifficulty difficulty;
    private final Integer durationDays;
    private final String coverImageUrl;

    // ── Schedule ──────────────────────────────────────────────────────────────

    private final LocalDate startDate;
    private final LocalDate endDate;
    private final LocalDate registrationDeadline;

    // ── Pricing ───────────────────────────────────────────────────────────────

    /** Full price per person. Always present. */
    private final BigDecimal price;

    /**
     * Discounted price per person. Present only when discountPrice != null
     * and discountPrice < price.
     */
    private final BigDecimal discountPrice;

    // ── Availability ─────────────────────────────────────────────────────────

    private final Integer totalSeats;
    private final Integer availableSeats;

    /**
     * Persisted status: OPEN or CANCELLED.
     * COMPLETED departures are excluded from this endpoint entirely.
     */
    private final DepartureStatus status;

    /**
     * Computed: true when availableSeats > 0 and availableSeats <= 30% of totalSeats.
     * Uses the identical threshold as TrekDepartureMapper.computeDerivedFlags.
     */
    private final boolean fillingFast;

    /**
     * Computed: true when availableSeats == 0.
     * Sold-out departures ARE included so customers can see demand and
     * optionally register interest (consistent with Trek Detail page behaviour).
     */
    private final boolean soldOut;
}
