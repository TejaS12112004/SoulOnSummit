package com.trekmanagement.settings;

import com.trekmanagement.settings.dto.AdminSiteSettingsResponse;
import com.trekmanagement.settings.dto.PublicSiteSettingsResponse;
import com.trekmanagement.settings.dto.SiteSettingsRequest;

public interface SiteSettingsService {
    AdminSiteSettingsResponse getAdminSettings();
    PublicSiteSettingsResponse getPublicSettings();
    AdminSiteSettingsResponse updateSettings(SiteSettingsRequest request);
}
