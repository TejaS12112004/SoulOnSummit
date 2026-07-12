package com.trekmanagement.trek.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.trekmanagement.trek.TrekDifficulty;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TrekSummaryResponse {

    private final UUID id;
    private final String title;
    private final String subtitle;
    private final String location;
    private final String state;
    private final TrekDifficulty difficulty;
    private final Integer durationDays;
    private final String coverImageUrl;
    private final boolean featured;
    private final boolean published;

    /**
     * Lowest effective price across this trek's active OPEN departures.
     * effectivePrice = discountPrice ?? price.
     * Null when no qualifying departures exist (e.g. draft trek).
     */
    private final BigDecimal lowestPrice;

    /**
     * Start date of the nearest upcoming OPEN departure.
     * Used by listing cards to show "Next Batch: Jan 15".
     * Null when no qualifying departures exist.
     */
    private final LocalDate nextDepartureDate;

    /**
     * Available seats on the next departure.
     * Used by listing cards for urgency badge ("Only 3 left!").
     * Null when no qualifying departures exist.
     */
    private final Integer nextDepartureAvailableSeats;
}
