package com.trekmanagement.settings;

import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.settings.dto.PublicSiteSettingsResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/settings/public")
@RequiredArgsConstructor
@Tag(name = "Public Settings", description = "Public-facing site configuration")
public class PublicSettingsController {

    private final SiteSettingsService siteSettingsService;

    @GetMapping
    @Operation(summary = "Get public site settings")
    public ResponseEntity<ApiResponse<PublicSiteSettingsResponse>> getPublicSettings() {
        PublicSiteSettingsResponse response = siteSettingsService.getPublicSettings();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
