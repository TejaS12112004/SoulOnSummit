package com.trekmanagement.trek;

import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.trek.dto.CreateItineraryDayRequest;
import com.trekmanagement.trek.dto.ItineraryDayResponse;
import com.trekmanagement.trek.dto.UpdateItineraryDayRequest;
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
 * Admin CRUD for Trek Day-wise Itinerary. There is no separate public itinerary endpoint —
 * itinerary days are surfaced to the public via TrekResponse.itinerary on
 * GET /api/v1/treks/{id} (see TrekController / TrekServiceImpl).
 */
@RestController
@RequiredArgsConstructor
@Tag(name = "Trek Itinerary", description = "Admin management of per-trek day-wise itinerary")
public class ItineraryDayController {

    private final ItineraryDayService itineraryDayService;

    // ═══════════════════════════════════════════════════════════════════════
    // ADMIN ITINERARY ENDPOINTS
    // Secured: ROLE_ADMIN (enforced in SecurityConfig + @PreAuthorize)
    // ═══════════════════════════════════════════════════════════════════════

    @PostMapping("/api/v1/admin/treks/{trekId}/itinerary")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add a new itinerary day to a trek (Admin)")
    public ResponseEntity<ApiResponse<ItineraryDayResponse>> createItineraryDay(
            @PathVariable UUID trekId,
            @Valid @RequestBody CreateItineraryDayRequest request) {

        ItineraryDayResponse response = itineraryDayService.createItineraryDay(trekId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Itinerary day created successfully", response));
    }

    @GetMapping("/api/v1/admin/treks/{trekId}/itinerary")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all itinerary days for a trek, ordered displayOrder ASC (Admin)")
    public ResponseEntity<ApiResponse<List<ItineraryDayResponse>>> listItineraryAdmin(
            @PathVariable UUID trekId) {

        return ResponseEntity.ok(ApiResponse.success(itineraryDayService.listItineraryAdmin(trekId)));
    }

    @PutMapping("/api/v1/admin/itinerary/{dayId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update an existing itinerary day (Admin)")
    public ResponseEntity<ApiResponse<ItineraryDayResponse>> updateItineraryDay(
            @PathVariable UUID dayId,
            @Valid @RequestBody UpdateItineraryDayRequest request) {

        ItineraryDayResponse response = itineraryDayService.updateItineraryDay(dayId, request);
        return ResponseEntity.ok(ApiResponse.success("Itinerary day updated successfully", response));
    }

    @DeleteMapping("/api/v1/admin/itinerary/{dayId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete an itinerary day (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteItineraryDay(
            @PathVariable UUID dayId) {

        itineraryDayService.deleteItineraryDay(dayId);
        return ResponseEntity.ok(ApiResponse.success("Itinerary day deleted successfully"));
    }
}
