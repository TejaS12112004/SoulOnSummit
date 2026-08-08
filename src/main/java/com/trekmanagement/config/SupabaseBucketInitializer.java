package com.trekmanagement.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class SupabaseBucketInitializer {

    private final WebClient supabaseWebClient;
    private final SupabaseConfig supabaseConfig;

    @PostConstruct
    public void initBuckets() {
        List<String> buckets = List.of(
                supabaseConfig.getStorage().getBucketImages(),
                supabaseConfig.getStorage().getBucketItineraries(),
                supabaseConfig.getStorage().getBucketInvoices(),
                supabaseConfig.getStorage().getBucketGallery(),
                supabaseConfig.getStorage().getBucketAvatars(),
                supabaseConfig.getStorage().getBucketBlogImages()
        );

        for (String bucket : buckets) {
            try {
                supabaseWebClient.get()
                        .uri("/storage/v1/bucket/{id}", bucket)
                        .retrieve()
                        .toBodilessEntity()
                        .block();
                log.info("Supabase bucket '{}' already exists.", bucket);
            } catch (Exception e) {
                log.info("Supabase bucket '{}' not found, creating it...", bucket);
                try {
                    supabaseWebClient.post()
                            .uri("/storage/v1/bucket")
                            .contentType(MediaType.APPLICATION_JSON)
                            .bodyValue("{\"id\": \"" + bucket + "\", \"name\": \"" + bucket + "\", \"public\": true}")
                            .retrieve()
                            .toBodilessEntity()
                            .block();
                    log.info("Successfully created public bucket '{}'", bucket);
                } catch (Exception createEx) {
                    log.error("Failed to create bucket '{}': {}", bucket, createEx.getMessage());
                }
            }
        }
    }
}
