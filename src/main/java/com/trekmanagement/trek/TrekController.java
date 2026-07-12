package com.trekmanagement.trek;

import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.common.dto.PageResponse;
import com.trekmanagement.trek.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
@Tag(name = "Treks", description = "Trek discovery, management, and departure scheduling")
public class TrekController {

    private final TrekService trekService;
    private final TrekDepartureService departureService;

    // ═══════════════════════════════════════════════════════════════════════
    // PUBLIC ENDPOINTS — /api/v1/treks/**
    // No authentication required (permitted in SecurityConfig)
    // ═══════════════════════════════════════════════════════════════════════

    @GetMapping("/api/v1/treks")
    @Operation(summary = "List published treks with filtering and pagination")
    public ResponseEntity<ApiResponse<PageResponse<TrekSummaryResponse>>> listPublicTreks(
            @Parameter(description = "Search by title")
            @RequestParam(required = false) String title,

            @Parameter(description = "Filter by difficulty: EASY, MODERATE, DIFFICULT, EXTREME")
            @RequestParam(required = false) TrekDifficulty difficulty,

            @Parameter(description = "Minimum duration in days")
            @RequestParam(required = false) Integer minDurationDays,

            @Parameter(description = "Maximum duration in days")
            @RequestParam(required = false) Integer maxDurationDays,

            @Parameter(description = "Minimum price — matched against active OPEN departures")
            @RequestParam(required = false) java.math.BigDecimal minPrice,

            @Parameter(description = "Maximum price — matched against active OPEN departures")
            @RequestParam(required = false) java.math.BigDecimal maxPrice,

            @Parameter(description = "Filter by state")
            @RequestParam(required = false) String state,

            @Parameter(description = "Filter by location keyword")
            @RequestParam(required = false) String location,

            @Parameter(description = "Filter featured treks only")
            @RequestParam(required = false) Boolean featured,

            @Parameter(description = "Departure start date from (ISO: yyyy-MM-dd)")
            @RequestParam(required = false) java.time.LocalDate startDateFrom,

            @Parameter(description = "Departure start date to (ISO: yyyy-MM-dd)")
            @RequestParam(required = false) java.time.LocalDate startDateTo,

            @Parameter(description = "Sort field: title | durationDays | createdAt")
            @RequestParam(defaultValue = "createdAt") String sortBy,

            @Parameter(description = "Sort direction: asc | desc")
            @RequestParam(defaultValue = "asc") String sortDir,

            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size) {

        TrekFilterRequest filter = buildFilter(title, difficulty, minDurationDays, maxDurationDays,
                minPrice, maxPrice, state, location, featured, null, null,
                startDateFrom, startDateTo, sortBy, sortDir, page, size);

        return ResponseEntity.ok(ApiResponse.success(trekService.listPublicTreks(filter)));
    }

    @GetMapping("/api/v1/treks/{id}")
    @Operation(summary = "Get full trek details by ID — includes OPEN future departures (published only)")
    public ResponseEntity<ApiResponse<TrekResponse>> getPublicTrek(
            @PathVariable UUID id) {

        return ResponseEntity.ok(ApiResponse.success(trekService.getPublicTrekById(id)));
    }

    @GetMapping("/api/v1/treks/{trekId}/departures")
    @Operation(summary = "List open upcoming departures for a published trek")
    public ResponseEntity<ApiResponse<List<DepartureResponse>>> listPublicDepartures(
            @PathVariable UUID trekId) {

        return ResponseEntity.ok(ApiResponse.success(departureService.listPublicDepartures(trekId)));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ADMIN TREK ENDPOINTS — /api/v1/admin/treks/**
    // Secured: ROLE_ADMIN (enforced in SecurityConfig + @PreAuthorize)
    // ═══════════════════════════════════════════════════════════════════════

    @PostMapping("/api/v1/admin/treks")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new trek (Admin)")
    public ResponseEntity<ApiResponse<TrekResponse>> createTrek(
            @Valid @RequestBody CreateTrekRequest request) {

        TrekResponse response = trekService.createTrek(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Trek created successfully", response));
    }

    @PutMapping("/api/v1/admin/treks/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update an existing trek (Admin)")
    public ResponseEntity<ApiResponse<TrekResponse>> updateTrek(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTrekRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success("Trek updated successfully", trekService.updateTrek(id, request)));
    }

    @DeleteMapping("/api/v1/admin/treks/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Soft-delete a trek and all its departures (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteTrek(
            @PathVariable UUID id) {

        trekService.deleteTrek(id);
        return ResponseEntity.ok(ApiResponse.success("Trek deleted successfully"));
    }

    @PatchMapping("/api/v1/admin/treks/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Publish a trek — requires cover image and at least one OPEN future departure (Admin)")
    public ResponseEntity<ApiResponse<Void>> publishTrek(
            @PathVariable UUID id) {

        trekService.publishTrek(id);
        return ResponseEntity.ok(ApiResponse.success("Trek published successfully"));
    }

    @PatchMapping("/api/v1/admin/treks/{id}/unpublish")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Unpublish a trek (Admin)")
    public ResponseEntity<ApiResponse<Void>> unpublishTrek(
            @PathVariable UUID id) {

        trekService.unpublishTrek(id);
        return ResponseEntity.ok(ApiResponse.success("Trek unpublished successfully"));
    }

    @PatchMapping("/api/v1/admin/treks/{id}/feature")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Set featured status on a trek (Admin)")
    public ResponseEntity<ApiResponse<Void>> featureTrek(
            @PathVariable UUID id,
            @RequestParam boolean featured) {

        trekService.featureTrek(id, featured);
        return ResponseEntity.ok(ApiResponse.success(
                featured ? "Trek marked as featured" : "Trek removed from featured"));
    }

    @GetMapping("/api/v1/admin/treks/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get any trek by ID including unpublished — includes all departures (Admin)")
    public ResponseEntity<ApiResponse<TrekResponse>> getAdminTrek(
            @PathVariable UUID id) {

        return ResponseEntity.ok(ApiResponse.success(trekService.getAdminTrekById(id)));
    }

    @GetMapping("/api/v1/admin/treks")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all treks with full admin filters (Admin)")
    public ResponseEntity<ApiResponse<PageResponse<TrekSummaryResponse>>> listAdminTreks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) TrekDifficulty difficulty,
            @RequestParam(required = false) Integer minDurationDays,
            @RequestParam(required = false) Integer maxDurationDays,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Boolean published,
            @RequestParam(required = false) java.time.LocalDate startDateFrom,
            @RequestParam(required = false) java.time.LocalDate startDateTo,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        TrekFilterRequest filter = buildFilter(title, difficulty, minDurationDays, maxDurationDays,
                minPrice, maxPrice, state, location, featured, isActive, published,
                startDateFrom, startDateTo, sortBy, sortDir, page, size);

        return ResponseEntity.ok(ApiResponse.success(trekService.listTreksAdmin(filter)));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ADMIN DEPARTURE ENDPOINTS — /api/v1/admin/treks/{trekId}/departures/**
    // All departure management is nested under the owning trek.
    // ═══════════════════════════════════════════════════════════════════════

    @PostMapping("/api/v1/admin/treks/{trekId}/departures")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add a new departure to a trek (Admin)")
    public ResponseEntity<ApiResponse<DepartureResponse>> createDeparture(
            @PathVariable UUID trekId,
            @Valid @RequestBody CreateDepartureRequest request) {

        DepartureResponse response = departureService.createDeparture(trekId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Departure created successfully", response));
    }

    @GetMapping("/api/v1/admin/treks/{trekId}/departures")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all departures for a trek — all statuses, ordered startDate ASC (Admin)")
    public ResponseEntity<ApiResponse<List<DepartureResponse>>> listDeparturesAdmin(
            @PathVariable UUID trekId) {

        return ResponseEntity.ok(
                ApiResponse.success(departureService.listDeparturesAdmin(trekId)));
    }

    @GetMapping("/api/v1/admin/treks/{trekId}/departures/{departureId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get a single departure by ID (Admin)")
    public ResponseEntity<ApiResponse<DepartureResponse>> getDepartureAdmin(
            @PathVariable UUID trekId,
            @PathVariable UUID departureId) {

        return ResponseEntity.ok(
                ApiResponse.success(departureService.getDepartureAdmin(trekId, departureId)));
    }

    @PutMapping("/api/v1/admin/treks/{trekId}/departures/{departureId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update a departure (Admin)")
    public ResponseEntity<ApiResponse<DepartureResponse>> updateDeparture(
            @PathVariable UUID trekId,
            @PathVariable UUID departureId,
            @Valid @RequestBody UpdateDepartureRequest request) {

        DepartureResponse response = departureService.updateDeparture(trekId, departureId, request);
        return ResponseEntity.ok(ApiResponse.success("Departure updated successfully", response));
    }

    @DeleteMapping("/api/v1/admin/treks/{trekId}/departures/{departureId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Soft-delete a departure (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteDeparture(
            @PathVariable UUID trekId,
            @PathVariable UUID departureId) {

        departureService.deleteDeparture(trekId, departureId);
        return ResponseEntity.ok(ApiResponse.success("Departure deleted successfully"));
    }

    @PatchMapping("/api/v1/admin/treks/{trekId}/departures/{departureId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Change departure status: OPEN | CANCELLED | COMPLETED (Admin)")
    public ResponseEntity<ApiResponse<DepartureResponse>> changeDepartureStatus(
            @PathVariable UUID trekId,
            @PathVariable UUID departureId,
            @RequestParam DepartureStatus status) {

        DepartureResponse response = departureService.changeStatus(trekId, departureId, status);
        return ResponseEntity.ok(ApiResponse.success(
                "Departure status updated to " + status.name(), response));
    }

    @PostMapping("/api/v1/admin/treks/{trekId}/departures/{departureId}/duplicate")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Duplicate an existing departure — copies all fields including dates (Admin). " +
                         "Edit the duplicated departure immediately to adjust dates for the new batch.")
    public ResponseEntity<ApiResponse<DepartureResponse>> duplicateDeparture(
            @PathVariable UUID trekId,
            @PathVariable UUID departureId) {

        DepartureResponse response = departureService.duplicateDeparture(trekId, departureId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Departure duplicated successfully", response));
    }

    // ── private factory ───────────────────────────────────────────────────────

    private TrekFilterRequest buildFilter(
            String title, TrekDifficulty difficulty,
            Integer minDurationDays, Integer maxDurationDays,
            java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice,
            String state, String location, Boolean featured,
            Boolean isActive, Boolean published,
            java.time.LocalDate startDateFrom, java.time.LocalDate startDateTo,
            String sortBy, String sortDir, int page, int size) {

        TrekFilterRequest f = new TrekFilterRequest();
        f.setTitle(title);
        f.setDifficulty(difficulty);
        f.setMinDurationDays(minDurationDays);
        f.setMaxDurationDays(maxDurationDays);
        f.setMinPrice(minPrice);
        f.setMaxPrice(maxPrice);
        f.setState(state);
        f.setLocation(location);
        f.setFeatured(featured);
        f.setIsActive(isActive);
        f.setPublished(published);
        f.setStartDateFrom(startDateFrom);
        f.setStartDateTo(startDateTo);
        f.setSortBy(sortBy);
        f.setSortDir(sortDir);
        f.setPage(page);
        f.setSize(size);
        return f;
    }
}
