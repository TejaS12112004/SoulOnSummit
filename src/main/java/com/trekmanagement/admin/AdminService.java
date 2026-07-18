package com.trekmanagement.admin;

import com.trekmanagement.admin.dto.DashboardChartsResponse;
import com.trekmanagement.admin.dto.DashboardMetricsResponse;

public interface AdminService {
    DashboardMetricsResponse getDashboardMetrics();
    DashboardChartsResponse getDashboardCharts();
}
