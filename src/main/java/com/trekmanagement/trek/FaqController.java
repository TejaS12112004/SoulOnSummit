package com.trekmanagement.trek;

import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.trek.dto.CreateFaqRequest;
import com.trekmanagement.trek.dto.FaqResponse;
import com.trekmanagement.trek.dto.UpdateFaqRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Admin CRUD for Trek FAQs. There is no separate public FAQ endpoint —
 * FAQs are surfaced to the public via TrekResponse.faqs on
 * GET /api/v1/treks/{id} (see TrekController / TrekServiceImpl).
 */
@RestController
@RequiredArgsConstructor
@Tag(name = "Trek FAQs", description = "Admin management of per-trek FAQs")
public class FaqController {

    private final FaqService faqService;

    // ═══════════════════════════════════════════════════════════════════════
    // ADMIN FAQ ENDPOINTS
    // Secured: ROLE_ADMIN (enforced in SecurityConfig + @PreAuthorize)
    // ═══════════════════════════════════════════════════════════════════════

    @PostMapping("/api/v1/admin/treks/{trekId}/faqs")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add a new FAQ to a trek (Admin)")
    public ResponseEntity<ApiResponse<FaqResponse>> createFaq(
            @PathVariable UUID trekId,
            @Valid @RequestBody CreateFaqRequest request) {

        FaqResponse response = faqService.createFaq(trekId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("FAQ created successfully", response));
    }

    @GetMapping("/api/v1/admin/treks/{trekId}/faqs")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all FAQs for a trek, ordered displayOrder ASC (Admin)")
    public ResponseEntity<ApiResponse<List<FaqResponse>>> listFaqsAdmin(
            @PathVariable UUID trekId) {

        return ResponseEntity.ok(ApiResponse.success(faqService.listFaqsAdmin(trekId)));
    }

    @PutMapping("/api/v1/admin/faqs/{faqId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update an existing FAQ (Admin)")
    public ResponseEntity<ApiResponse<FaqResponse>> updateFaq(
            @PathVariable UUID faqId,
            @Valid @RequestBody UpdateFaqRequest request) {

        FaqResponse response = faqService.updateFaq(faqId, request);
        return ResponseEntity.ok(ApiResponse.success("FAQ updated successfully", response));
    }

    @DeleteMapping("/api/v1/admin/faqs/{faqId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a FAQ (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteFaq(
            @PathVariable UUID faqId) {

        faqService.deleteFaq(faqId);
        return ResponseEntity.ok(ApiResponse.success("FAQ deleted successfully"));
    }
}
