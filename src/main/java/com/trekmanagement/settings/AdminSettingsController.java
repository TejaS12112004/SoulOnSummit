package com.trekmanagement.settings;

import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.settings.dto.AdminSiteSettingsResponse;
import com.trekmanagement.settings.dto.SiteSettingsRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/settings")
@RequiredArgsConstructor
@Tag(name = "Admin Settings", description = "Admin site configuration")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSettingsController {

    private final SiteSettingsService siteSettingsService;

    @GetMapping
    @Operation(summary = "Get global site settings")
    public ResponseEntity<ApiResponse<AdminSiteSettingsResponse>> getSettings() {
        AdminSiteSettingsResponse response = siteSettingsService.getAdminSettings();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping
    @Operation(summary = "Update global site settings")
    public ResponseEntity<ApiResponse<AdminSiteSettingsResponse>> updateSettings(
            @Valid @RequestBody SiteSettingsRequest request) {
        AdminSiteSettingsResponse response = siteSettingsService.updateSettings(request);
        return ResponseEntity.ok(ApiResponse.success("Settings updated successfully", response));
    }
}
