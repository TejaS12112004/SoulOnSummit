package com.trekmanagement.review;

import com.trekmanagement.review.dto.AdminReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ReviewService {
    Page<AdminReviewResponse> searchAdminReviews(String search, String status, Boolean featured, Pageable pageable);
    void setApprovalStatus(UUID reviewId, boolean approved);
    void setFeaturedStatus(UUID reviewId, boolean featured);
}
