package com.trekmanagement.settings.dto;

import lombok.Data;

@Data
public class SiteSettingsRequest {
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
}
