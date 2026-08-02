package com.trekmanagement.settings;

import com.trekmanagement.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "site_settings")
public class SiteSettings extends BaseEntity {

    // General / Company
    @Column(name = "company_name")
    private String companyName;

    @Column(name = "support_email")
    private String supportEmail;

    @Column(name = "support_phone")
    private String supportPhone;

    @Column(name = "business_address", columnDefinition = "TEXT")
    private String businessAddress;

    // Social Media
    @Column(name = "instagram_url", length = 1024)
    private String instagramUrl;

    @Column(name = "facebook_url", length = 1024)
    private String facebookUrl;

    @Column(name = "youtube_url", length = 1024)
    private String youtubeUrl;

    @Column(name = "twitter_url", length = 1024)
    private String twitterUrl;

    // Default SEO
    @Column(name = "default_meta_title")
    private String defaultMetaTitle;

    @Column(name = "default_meta_description", columnDefinition = "TEXT")
    private String defaultMetaDescription;

    // Branding
    @Column(name = "logo_url", length = 1024)
    private String logoUrl;

    @Column(name = "favicon_url", length = 1024)
    private String faviconUrl;
}
