package com.trekmanagement.trek.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Partial update — only non-null fields are applied (see ItineraryDayServiceImpl).
 */
@Getter
@Setter
public class UpdateItineraryDayRequest {

    @Min(value = 1, message = "Day number must be at least 1")
    private Integer dayNumber;

    private String title;

    private String description;

    private String stay;

    private String meals;

    @DecimalMin(value = "0.0", inclusive = true, message = "Distance must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "Distance must have at most 8 integer and 2 fraction digits")
    private BigDecimal distanceKm;

    @DecimalMin(value = "0.0", inclusive = true, message = "Duration must be non-negative")
    @Digits(integer = 5, fraction = 2, message = "Duration must have at most 5 integer and 2 fraction digits")
    private BigDecimal durationHours;

    private Integer altitude;

    private String imageUrl;

    @Min(value = 0, message = "Display order must be non-negative")
    private Integer displayOrder;
}
