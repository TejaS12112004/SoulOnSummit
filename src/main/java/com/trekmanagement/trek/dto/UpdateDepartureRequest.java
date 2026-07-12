package com.trekmanagement.trek.dto;

import com.trekmanagement.trek.DepartureStatus;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class UpdateDepartureRequest {

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate registrationDeadline;

    @DecimalMin(value = "0.0", message = "Price must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "Price must have at most 8 integer and 2 fraction digits")
    private BigDecimal price;

    @DecimalMin(value = "0.0", message = "Discount price must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "Discount price format invalid")
    private BigDecimal discountPrice;

    @Min(value = 1, message = "Total seats must be at least 1")
    private Integer totalSeats;

    @Min(value = 0, message = "Available seats must be non-negative")
    private Integer availableSeats;

    private DepartureStatus status;
}
