package com.trekmanagement.trek;

import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.trek.dto.CreateInclusionRequest;
import com.trekmanagement.trek.dto.InclusionResponse;
import com.trekmanagement.trek.dto.UpdateInclusionRequest;
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

@RestController
@RequiredArgsConstructor
@Tag(name = "Trek Inclusions", description = "Admin management of per-trek inclusions")
public class InclusionController {

    private final InclusionService inclusionService;

    @PostMapping("/api/v1/admin/treks/{trekId}/inclusions")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add a new inclusion to a trek (Admin)")
    public ResponseEntity<ApiResponse<InclusionResponse>> createInclusion(
            @PathVariable UUID trekId,
            @Valid @RequestBody CreateInclusionRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Inclusion created successfully",
                        inclusionService.createInclusion(trekId, request)));
    }

    @GetMapping("/api/v1/admin/treks/{trekId}/inclusions")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all inclusions for a trek, ordered displayOrder ASC (Admin)")
    public ResponseEntity<ApiResponse<List<InclusionResponse>>> listInclusionsAdmin(
            @PathVariable UUID trekId) {

        return ResponseEntity.ok(ApiResponse.success(inclusionService.listInclusionsAdmin(trekId)));
    }

    @PutMapping("/api/v1/admin/inclusions/{inclusionId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update an existing inclusion (Admin)")
    public ResponseEntity<ApiResponse<InclusionResponse>> updateInclusion(
            @PathVariable UUID inclusionId,
            @Valid @RequestBody UpdateInclusionRequest request) {

        return ResponseEntity.ok(ApiResponse.success("Inclusion updated successfully",
                inclusionService.updateInclusion(inclusionId, request)));
    }

    @DeleteMapping("/api/v1/admin/inclusions/{inclusionId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete an inclusion (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteInclusion(
            @PathVariable UUID inclusionId) {

        inclusionService.deleteInclusion(inclusionId);
        return ResponseEntity.ok(ApiResponse.success("Inclusion deleted successfully"));
    }
}
