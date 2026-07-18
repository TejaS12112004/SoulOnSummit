package com.trekmanagement.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class DashboardChartsResponse {
    private List<ChartDataPoint> bookingsLast30Days;
    private List<ChartDataPoint> revenueLast30Days;
    private List<ChartDataPoint> usersLast30Days;

    @Data
    @Builder
    public static class ChartDataPoint {
        private LocalDate date;
        private BigDecimal value; // Reusing BigDecimal for uniform chart points (value can be count or amount)
    }
}
