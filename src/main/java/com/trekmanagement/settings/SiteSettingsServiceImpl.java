package com.trekmanagement.settings;

import com.trekmanagement.settings.dto.AdminSiteSettingsResponse;
import com.trekmanagement.settings.dto.PublicSiteSettingsResponse;
import com.trekmanagement.settings.dto.SiteSettingsRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SiteSettingsServiceImpl implements SiteSettingsService {

    private final SiteSettingsRepository siteSettingsRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminSiteSettingsResponse getAdminSettings() {
        SiteSettings settings = getOrCreateSingleton();
        return mapToAdminResponse(settings);
    }

    @Override
    @Transactional(readOnly = true)
    public PublicSiteSettingsResponse getPublicSettings() {
        SiteSettings settings = getOrCreateSingleton();
        return mapToPublicResponse(settings);
    }

    @Override
    @Transactional
    public AdminSiteSettingsResponse updateSettings(SiteSettingsRequest request) {
        SiteSettings settings = getOrCreateSingleton();

        settings.setCompanyName(request.getCompanyName());
        settings.setSupportEmail(request.getSupportEmail());
        settings.setSupportPhone(request.getSupportPhone());
        settings.setBusinessAddress(request.getBusinessAddress());
        
        settings.setInstagramUrl(request.getInstagramUrl());
        settings.setFacebookUrl(request.getFacebookUrl());
        settings.setYoutubeUrl(request.getYoutubeUrl());
        settings.setTwitterUrl(request.getTwitterUrl());
        
        settings.setDefaultMetaTitle(request.getDefaultMetaTitle());
        settings.setDefaultMetaDescription(request.getDefaultMetaDescription());
        
        settings.setLogoUrl(request.getLogoUrl());
        settings.setFaviconUrl(request.getFaviconUrl());

        SiteSettings saved = siteSettingsRepository.save(settings);
        return mapToAdminResponse(saved);
    }

    private SiteSettings getOrCreateSingleton() {
        return siteSettingsRepository.findSingleton().orElseGet(() -> {
            SiteSettings settings = new SiteSettings();
            settings.setCompanyName("TrekManagement");
            settings.setSupportEmail("support@example.com");
            return siteSettingsRepository.save(settings);
        });
    }

    private AdminSiteSettingsResponse mapToAdminResponse(SiteSettings s) {
        return AdminSiteSettingsResponse.builder()
                .companyName(s.getCompanyName())
                .supportEmail(s.getSupportEmail())
                .supportPhone(s.getSupportPhone())
                .businessAddress(s.getBusinessAddress())
                .instagramUrl(s.getInstagramUrl())
                .facebookUrl(s.getFacebookUrl())
                .youtubeUrl(s.getYoutubeUrl())
                .twitterUrl(s.getTwitterUrl())
                .defaultMetaTitle(s.getDefaultMetaTitle())
                .defaultMetaDescription(s.getDefaultMetaDescription())
                .logoUrl(s.getLogoUrl())
                .faviconUrl(s.getFaviconUrl())
                .updatedAt(s.getUpdatedAt())
                .build();
    }

    private PublicSiteSettingsResponse mapToPublicResponse(SiteSettings s) {
        return PublicSiteSettingsResponse.builder()
                .companyName(s.getCompanyName())
                .supportEmail(s.getSupportEmail())
                .supportPhone(s.getSupportPhone())
                .businessAddress(s.getBusinessAddress())
                .instagramUrl(s.getInstagramUrl())
                .facebookUrl(s.getFacebookUrl())
                .youtubeUrl(s.getYoutubeUrl())
                .twitterUrl(s.getTwitterUrl())
                .defaultMetaTitle(s.getDefaultMetaTitle())
                .defaultMetaDescription(s.getDefaultMetaDescription())
                .logoUrl(s.getLogoUrl())
                .faviconUrl(s.getFaviconUrl())
                .build();
    }
}
