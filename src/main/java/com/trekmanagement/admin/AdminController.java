package com.trekmanagement.admin;

import com.trekmanagement.admin.dto.DashboardChartsResponse;
import com.trekmanagement.admin.dto.DashboardMetricsResponse;
import com.trekmanagement.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin dashboard and general endpoints")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get high-level dashboard metrics (Admin)")
    public ResponseEntity<ApiResponse<DashboardMetricsResponse>> getDashboardMetrics() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardMetrics()));
    }

    @GetMapping("/dashboard/charts")
    @Operation(summary = "Get 30-day historical chart data (Admin)")
    public ResponseEntity<ApiResponse<DashboardChartsResponse>> getDashboardCharts() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardCharts()));
    }
}
