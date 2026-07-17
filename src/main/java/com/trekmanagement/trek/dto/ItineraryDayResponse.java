package com.trekmanagement.trek.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ItineraryDayResponse {

    private final UUID id;
    private final UUID trekId;

    private final Integer dayNumber;
    private final String title;
    private final String description;

    private final String stay;
    private final String meals;
    private final BigDecimal distanceKm;
    private final BigDecimal durationHours;
    private final Integer altitude;
    private final String imageUrl;

    private final int displayOrder;

    private final Instant createdAt;
    private final Instant updatedAt;
}
