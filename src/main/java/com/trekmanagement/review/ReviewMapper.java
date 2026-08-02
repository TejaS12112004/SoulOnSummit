package com.trekmanagement.review;

import com.trekmanagement.review.dto.AdminReviewResponse;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public AdminReviewResponse toAdminResponse(Review review) {
        if (review == null) {
            return null;
        }

        return AdminReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .title(review.getTitle())
                .body(review.getBody())
                .approved(review.getApproved())
                .featured(review.getFeatured())
                .createdAt(review.getCreatedAt())
                .user(AdminReviewResponse.UserDetails.builder()
                        .id(review.getUser().getId())
                        .name(review.getUser().getFirstName() + " " + review.getUser().getLastName())
                        .email(review.getUser().getEmail())
                        .profileImageUrl(review.getUser().getProfileImageUrl())
                        .build())
                .trek(AdminReviewResponse.TrekDetails.builder()
                        .id(review.getTrek().getId())
                        .title(review.getTrek().getTitle())
                        .build())
                .build();
    }
}
