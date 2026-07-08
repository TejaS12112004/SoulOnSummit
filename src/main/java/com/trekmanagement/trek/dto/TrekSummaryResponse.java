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
    private final BigDecimal price;
    private final BigDecimal discountPrice;
    private final Integer availableSeats;
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final String coverImageUrl;
    private final boolean featured;
    private final boolean published;
}
