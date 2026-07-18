package com.trekmanagement.trek;

import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.trek.dto.CreateExclusionRequest;
import com.trekmanagement.trek.dto.ExclusionResponse;
import com.trekmanagement.trek.dto.UpdateExclusionRequest;
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
@Tag(name = "Trek Exclusions", description = "Admin management of per-trek exclusions")
public class ExclusionController {

    private final ExclusionService exclusionService;

    @PostMapping("/api/v1/admin/treks/{trekId}/exclusions")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add a new exclusion to a trek (Admin)")
    public ResponseEntity<ApiResponse<ExclusionResponse>> createExclusion(
            @PathVariable UUID trekId,
            @Valid @RequestBody CreateExclusionRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Exclusion created successfully",
                        exclusionService.createExclusion(trekId, request)));
    }

    @GetMapping("/api/v1/admin/treks/{trekId}/exclusions")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all exclusions for a trek, ordered displayOrder ASC (Admin)")
    public ResponseEntity<ApiResponse<List<ExclusionResponse>>> listExclusionsAdmin(
            @PathVariable UUID trekId) {

        return ResponseEntity.ok(ApiResponse.success(exclusionService.listExclusionsAdmin(trekId)));
    }

    @PutMapping("/api/v1/admin/exclusions/{exclusionId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update an existing exclusion (Admin)")
    public ResponseEntity<ApiResponse<ExclusionResponse>> updateExclusion(
            @PathVariable UUID exclusionId,
            @Valid @RequestBody UpdateExclusionRequest request) {

        return ResponseEntity.ok(ApiResponse.success("Exclusion updated successfully",
                exclusionService.updateExclusion(exclusionId, request)));
    }

    @DeleteMapping("/api/v1/admin/exclusions/{exclusionId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete an exclusion (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteExclusion(
            @PathVariable UUID exclusionId) {

        exclusionService.deleteExclusion(exclusionId);
        return ResponseEntity.ok(ApiResponse.success("Exclusion deleted successfully"));
    }
}
