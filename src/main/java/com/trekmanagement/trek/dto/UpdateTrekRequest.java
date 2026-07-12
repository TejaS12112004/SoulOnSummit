package com.trekmanagement.trek.dto;

import com.trekmanagement.trek.TrekDifficulty;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class UpdateTrekRequest {

    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @Size(max = 255, message = "Subtitle must not exceed 255 characters")
    private String subtitle;

    private String description;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @Size(max = 100)
    private String state;

    @Size(max = 100)
    private String country;

    private TrekDifficulty difficulty;

    @Min(value = 1, message = "Duration must be at least 1 day")
    private Integer durationDays;

    @DecimalMin(value = "0.0", inclusive = false, message = "Distance must be positive")
    private BigDecimal distanceKm;

    @Min(value = 0, message = "Max altitude must be non-negative")
    private Integer maxAltitude;

    @Size(max = 255)
    private String summitPoint;

    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    private BigDecimal latitude;

    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    private BigDecimal longitude;

    @Size(max = 255)
    private String pickupPoint;

    @Size(max = 255)
    private String dropPoint;

    private String coverImageUrl;
    private String itineraryPdfUrl;
    private String included;
    private String excluded;
    private String thingsToCarry;
    private String cancellationPolicy;
}
