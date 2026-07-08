package com.trekmanagement.trek.dto;

import com.trekmanagement.trek.TrekDifficulty;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CreateTrekRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @Size(max = 255, message = "Subtitle must not exceed 255 characters")
    private String subtitle;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Location is required")
    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @Size(max = 100, message = "State must not exceed 100 characters")
    private String state;

    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    @NotNull(message = "Difficulty is required")
    private TrekDifficulty difficulty;

    @NotNull(message = "Duration in days is required")
    @Min(value = 1, message = "Duration must be at least 1 day")
    private Integer durationDays;

    @DecimalMin(value = "0.0", inclusive = false, message = "Distance must be positive")
    private BigDecimal distanceKm;

    @Min(value = 0, message = "Max altitude must be non-negative")
    private Integer maxAltitude;

    @Size(max = 255)
    private String summitPoint;

    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0",  message = "Latitude must be <= 90")
    private BigDecimal latitude;

    @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
    @DecimalMax(value = "180.0",  message = "Longitude must be <= 180")
    private BigDecimal longitude;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", message = "Price must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "Price must have at most 8 integer and 2 fraction digits")
    private BigDecimal price;

    @DecimalMin(value = "0.0", message = "Discount price must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "Discount price format invalid")
    private BigDecimal discountPrice;

    @NotNull(message = "Total seats is required")
    @Min(value = 1, message = "Total seats must be at least 1")
    private Integer totalSeats;

    @NotNull(message = "Start date is required")
    @Future(message = "Start date must be in the future")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;

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
