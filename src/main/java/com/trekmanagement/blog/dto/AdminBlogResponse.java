package com.trekmanagement.blog.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class AdminBlogResponse {
    private UUID id;
    private String title;
    private String slug;
    private String summary;
    private String body;
    private String featuredImage;
    private Boolean published;
    private Instant publishedAt;
    private Instant createdAt;
    private Instant updatedAt;
    private AuthorDetails author;

    @Data
    @Builder
    public static class AuthorDetails {
        private UUID id;
        private String name;
        private String email;
        private String profileImageUrl;
    }
}
