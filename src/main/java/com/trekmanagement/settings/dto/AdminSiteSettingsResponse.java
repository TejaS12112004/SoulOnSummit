package com.trekmanagement.settings.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class AdminSiteSettingsResponse {
    private String companyName;
    private String supportEmail;
    private String supportPhone;
    private String businessAddress;

    private String instagramUrl;
    private String facebookUrl;
    private String youtubeUrl;
    private String twitterUrl;

    private String defaultMetaTitle;
    private String defaultMetaDescription;

    private String logoUrl;
    private String faviconUrl;
    
    private Instant updatedAt;
}
