package com.trekmanagement.trek.dto;

import com.trekmanagement.trek.TrekDifficulty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class TrekFilterRequest {

    // ── Search ────────────────────────────────────────────────────────────────
    private String title;

    // ── Filters ───────────────────────────────────────────────────────────────
    private TrekDifficulty difficulty;

    @Min(value = 1, message = "Minimum duration must be at least 1 day")
    private Integer minDurationDays;

    @Min(value = 1, message = "Maximum duration must be at least 1 day")
    private Integer maxDurationDays;

    @DecimalMin(value = "0.0", message = "Minimum price must be non-negative")
    private BigDecimal minPrice;

    @DecimalMin(value = "0.0", message = "Maximum price must be non-negative")
    private BigDecimal maxPrice;

    private String state;
    private String location;
    private Boolean featured;
    private Boolean isActive;
    private Boolean published;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDateFrom;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDateTo;

    // ── Pagination ────────────────────────────────────────────────────────────
    @Min(value = 0, message = "Page number must be non-negative")
    private int page = 0;

    @Min(value = 1, message = "Page size must be at least 1")
    private int size = 20;

    // ── Sort ─────────────────────────────────────────────────────────────────
    // Allowed values: price, startDate, title, durationDays
    private String sortBy = "startDate";

    // asc | desc
    private String sortDir = "asc";
}
