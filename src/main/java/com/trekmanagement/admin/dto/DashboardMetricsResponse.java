package com.trekmanagement.admin.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class DashboardMetricsResponse {
    private long todayBookings;
    private BigDecimal totalRevenue;
    private long upcomingDepartures;
    private long totalUsers;
    private long pendingPayments;
}
