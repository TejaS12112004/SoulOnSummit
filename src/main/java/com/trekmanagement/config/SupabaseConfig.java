package com.trekmanagement.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.supabase")
public class SupabaseConfig {

    private String url;
    private String serviceRoleKey;
    private Storage storage;

    @Getter
    @Setter
    public static class Storage {
        private String bucketImages;
        private String bucketItineraries;
        private String bucketInvoices;
        private String bucketGallery;
        private String bucketAvatars;
        private String bucketBlogImages;
        private long signedUrlExpirySeconds;
    }

    @Bean
    public WebClient supabaseWebClient() {
        return WebClient.builder()
                .baseUrl(url)
                .defaultHeader("apikey", serviceRoleKey)
                .defaultHeader("Authorization", "Bearer " + serviceRoleKey)
                .defaultHeader("Content-Type", "application/octet-stream")
                .build();
    }
}
