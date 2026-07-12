package com.trekmanagement.trek.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.trekmanagement.trek.DepartureStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DepartureResponse {

    private final UUID id;
    private final UUID trekId;

    private final LocalDate startDate;
    private final LocalDate endDate;
    private final LocalDate registrationDeadline;

    private final BigDecimal price;
    private final BigDecimal discountPrice;

    private final Integer totalSeats;
    private final Integer availableSeats;

    /** Persisted status: OPEN, CANCELLED, or COMPLETED. */
    private final DepartureStatus status;

    /**
     * Computed in service layer: true when availableSeats > 0
     * and availableSeats <= 30% of totalSeats.
     * Never persisted.
     */
    private final boolean isFillingFast;

    /**
     * Computed in service layer: true when availableSeats == 0.
     * Never persisted.
     */
    private final boolean isSoldOut;

    private final boolean active;

    private final Instant createdAt;
    private final Instant updatedAt;
}
