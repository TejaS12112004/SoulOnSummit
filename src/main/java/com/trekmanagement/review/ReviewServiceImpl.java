package com.trekmanagement.review;

import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.review.dto.AdminReviewResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminReviewResponse> searchAdminReviews(String search, String status, Boolean featured, Pageable pageable) {
        Page<Review> reviews = reviewRepository.searchReviews(search, status, featured, pageable);
        return reviews.map(reviewMapper::toAdminResponse);
    }

    @Override
    @Transactional
    public void setApprovalStatus(UUID reviewId, boolean approved) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        review.setApproved(approved);

        // If unapproved, it MUST be unfeatured.
        if (!approved && review.getFeatured()) {
            review.setFeatured(false);
            log.info("Automatically unfeaturing review {} because it was unapproved.", reviewId);
        }

        reviewRepository.save(review);
    }

    @Override
    @Transactional
    public void setFeaturedStatus(UUID reviewId, boolean featured) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        // Cannot feature an unapproved review
        if (featured && !review.getApproved()) {
            throw new ValidationException("Cannot feature a review that is not approved.");
        }

        review.setFeatured(featured);
        reviewRepository.save(review);
    }
}
