package com.trekmanagement.review;

import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.common.dto.PageResponse;
import com.trekmanagement.review.dto.AdminReviewResponse;
import com.trekmanagement.review.dto.ReviewStatusRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/reviews")
@RequiredArgsConstructor
@Tag(name = "Admin Reviews", description = "Admin review moderation and management")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminReviewController {

    private final ReviewService reviewService;

    @GetMapping
    @Operation(summary = "List all reviews (Admin) with filtering and pagination")
    public ResponseEntity<ApiResponse<PageResponse<AdminReviewResponse>>> listReviewsAdmin(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status, // ALL, PENDING, APPROVED
            @RequestParam(required = false) Boolean featured,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        // Whitelist allowed sort fields to prevent sorting injection
        String actualSortBy = switch (sortBy) {
            case "rating", "approved", "featured" -> sortBy;
            default -> "createdAt";
        };

        // Normalize status
        String actualStatus = null;
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            actualStatus = status.toUpperCase();
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), actualSortBy));
        Page<AdminReviewResponse> result = reviewService.searchAdminReviews(search, actualStatus, featured, pageable);

        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(result)));
    }

    @PatchMapping("/{id}/approval")
    @Operation(summary = "Set approval status of a review")
    public ResponseEntity<ApiResponse<Void>> setApprovalStatus(@PathVariable UUID id, @RequestBody ReviewStatusRequest request) {
        reviewService.setApprovalStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Review approval status updated successfully"));
    }

    @PatchMapping("/{id}/featured")
    @Operation(summary = "Set featured status of a review")
    public ResponseEntity<ApiResponse<Void>> setFeaturedStatus(@PathVariable UUID id, @RequestBody ReviewStatusRequest request) {
        reviewService.setFeaturedStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Review featured status updated successfully"));
    }
}
