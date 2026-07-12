package com.trekmanagement.trek.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CreateDepartureRequest {

    @NotNull(message = "Start date is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;

    /**
     * Mandatory for every new departure — the admin API requires this explicitly.
     * The service layer never derives or defaults this value (e.g. no automatic
     * "startDate - 7 days" fallback). That -7-day rule exists ONLY inside the
     * one-time V2 migration, to backfill deadlines for departures that were
     * created from pre-existing trek data before this field existed.
     */
    @NotNull(message = "Registration deadline is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate registrationDeadline;

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

    /**
     * If not provided, defaults to totalSeats (all seats open on creation).
     * Must be >= 0 and <= totalSeats — enforced in service layer.
     */
    @Min(value = 0, message = "Available seats must be non-negative")
    private Integer availableSeats;
}
