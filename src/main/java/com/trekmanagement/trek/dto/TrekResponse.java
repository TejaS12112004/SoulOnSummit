package com.trekmanagement.trek.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.trekmanagement.trek.TrekDifficulty;
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
    private final BigDecimal price;
    private final BigDecimal discountPrice;
    private final Integer totalSeats;
    private final Integer availableSeats;
    private final LocalDate startDate;
    private final LocalDate endDate;
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
    private final Instant createdAt;
    private final Instant updatedAt;
}
