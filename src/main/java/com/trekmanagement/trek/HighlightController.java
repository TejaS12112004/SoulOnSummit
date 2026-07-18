package com.trekmanagement.trek;

import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.trek.dto.CreateHighlightRequest;
import com.trekmanagement.trek.dto.HighlightResponse;
import com.trekmanagement.trek.dto.UpdateHighlightRequest;
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
 * Admin CRUD for Trek Highlights. There is no separate public highlights endpoint —
 * highlights are surfaced to the public via TrekResponse.highlights on
 * GET /api/v1/treks/{id} (see TrekController / TrekServiceImpl).
 */
@RestController
@RequiredArgsConstructor
@Tag(name = "Trek Highlights", description = "Admin management of per-trek highlights")
public class HighlightController {

    private final HighlightService highlightService;

    // ═══════════════════════════════════════════════════════════════════════
    // ADMIN HIGHLIGHT ENDPOINTS
    // Secured: ROLE_ADMIN (enforced in SecurityConfig + @PreAuthorize)
    // ═══════════════════════════════════════════════════════════════════════

    @PostMapping("/api/v1/admin/treks/{trekId}/highlights")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add a new highlight to a trek (Admin)")
    public ResponseEntity<ApiResponse<HighlightResponse>> createHighlight(
            @PathVariable UUID trekId,
            @Valid @RequestBody CreateHighlightRequest request) {

        HighlightResponse response = highlightService.createHighlight(trekId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Highlight created successfully", response));
    }

    @GetMapping("/api/v1/admin/treks/{trekId}/highlights")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all highlights for a trek, ordered displayOrder ASC (Admin)")
    public ResponseEntity<ApiResponse<List<HighlightResponse>>> listHighlightsAdmin(
            @PathVariable UUID trekId) {

        return ResponseEntity.ok(ApiResponse.success(highlightService.listHighlightsAdmin(trekId)));
    }

    @PutMapping("/api/v1/admin/highlights/{highlightId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update an existing highlight (Admin)")
    public ResponseEntity<ApiResponse<HighlightResponse>> updateHighlight(
            @PathVariable UUID highlightId,
            @Valid @RequestBody UpdateHighlightRequest request) {

        HighlightResponse response = highlightService.updateHighlight(highlightId, request);
        return ResponseEntity.ok(ApiResponse.success("Highlight updated successfully", response));
    }

    @DeleteMapping("/api/v1/admin/highlights/{highlightId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a highlight (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteHighlight(
            @PathVariable UUID highlightId) {

        highlightService.deleteHighlight(highlightId);
        return ResponseEntity.ok(ApiResponse.success("Highlight deleted successfully"));
    }
}
