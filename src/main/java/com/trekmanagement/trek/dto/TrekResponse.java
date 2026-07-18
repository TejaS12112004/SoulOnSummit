package com.trekmanagement.trek.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.trekmanagement.trek.TrekDifficulty;
import com.trekmanagement.trek.dto.HighlightResponse;
import com.trekmanagement.trek.dto.ItineraryDayResponse;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TrekResponse {

    private final UUID id;
    private final String title;
    private final String subtitle;
    private final String description;
    private final String location;
    private final String state;
    private final String country;
    private final TrekDifficulty difficulty;
    private final Integer durationDays;
    private final BigDecimal distanceKm;
    private final Integer maxAltitude;
    private final String summitPoint;
    private final BigDecimal latitude;
    private final BigDecimal longitude;

    /**
     * pickupPoint is displayed as "Meeting Point" in the User Dashboard
     * upcoming trek widget. No separate meetingPoint field needed.
     */
    private final String pickupPoint;
    private final String dropPoint;

    private final String coverImageUrl;
    private final String itineraryPdfUrl;
    private final String included;
    private final String excluded;
    private final String thingsToCarry;
    private final String cancellationPolicy;

    private final boolean featured;
    private final boolean published;
    private final boolean active;

    private final List<TrekImageResponse> images;

    private final List<FaqResponse> faqs;

    private final List<ItineraryDayResponse> itineraryDays;

    private final List<HighlightResponse> highlights;

    /**
     * All departures for this trek, ordered by startDate ASC.
     * Public endpoint returns only OPEN future departures.
     * Admin endpoint returns all departures regardless of status.
     */
    private final List<DepartureResponse> departures;

    /**
     * Lowest effective price across active OPEN departures.
     * effectivePrice = discountPrice ?? price.
     * Null when no active departures exist.
     */
    private final BigDecimal lowestPrice;

    /**
     * startDate of the nearest upcoming OPEN departure.
     * Null when no active future departures exist.
     */
    private final LocalDate nextDepartureDate;

    private final Instant createdAt;
    private final Instant updatedAt;
}
