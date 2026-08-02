package com.trekmanagement.review.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class AdminReviewResponse {
    private UUID id;
    private Integer rating;
    private String title;
    private String body;
    private Boolean approved;
    private Boolean featured;
    private Instant createdAt;
    private UserDetails user;
    private TrekDetails trek;

    @Data
    @Builder
    public static class UserDetails {
        private UUID id;
        private String name;
        private String email;
        private String profileImageUrl;
    }

    @Data
    @Builder
    public static class TrekDetails {
        private UUID id;
        private String title;
    }
}
