package com.trekmanagement.blog;

import com.trekmanagement.blog.dto.AdminBlogResponse;
import org.springframework.stereotype.Component;

@Component
public class BlogMapper {

    public AdminBlogResponse toAdminResponse(Blog blog) {
        if (blog == null) {
            return null;
        }

        return AdminBlogResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .slug(blog.getSlug())
                .summary(blog.getSummary())
                .body(blog.getBody())
                .featuredImage(blog.getFeaturedImage())
                .published(blog.getPublished())
                .publishedAt(blog.getPublishedAt())
                .createdAt(blog.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .author(AdminBlogResponse.AuthorDetails.builder()
                        .id(blog.getAuthor().getId())
                        .name(blog.getAuthor().getFirstName() + " " + blog.getAuthor().getLastName())
                        .email(blog.getAuthor().getEmail())
                        .profileImageUrl(blog.getAuthor().getProfileImageUrl())
                        .build())
                .build();
    }
}
