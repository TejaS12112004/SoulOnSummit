package com.trekmanagement.trek;

import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.trek.dto.CreatePackingItemRequest;
import com.trekmanagement.trek.dto.PackingItemResponse;
import com.trekmanagement.trek.dto.UpdatePackingItemRequest;
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
@Tag(name = "Trek Packing Items", description = "Admin management of per-trek packing items")
public class PackingItemController {

    private final PackingItemService packingItemService;

    @PostMapping("/api/v1/admin/treks/{trekId}/packing-items")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add a new packing item to a trek (Admin)")
    public ResponseEntity<ApiResponse<PackingItemResponse>> createPackingItem(
            @PathVariable UUID trekId,
            @Valid @RequestBody CreatePackingItemRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Packing item created successfully",
                        packingItemService.createPackingItem(trekId, request)));
    }

    @GetMapping("/api/v1/admin/treks/{trekId}/packing-items")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all packing items for a trek, ordered displayOrder ASC (Admin)")
    public ResponseEntity<ApiResponse<List<PackingItemResponse>>> listPackingItemsAdmin(
            @PathVariable UUID trekId) {

        return ResponseEntity.ok(ApiResponse.success(packingItemService.listPackingItemsAdmin(trekId)));
    }

    @PutMapping("/api/v1/admin/packing-items/{itemId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update an existing packing item (Admin)")
    public ResponseEntity<ApiResponse<PackingItemResponse>> updatePackingItem(
            @PathVariable UUID itemId,
            @Valid @RequestBody UpdatePackingItemRequest request) {

        return ResponseEntity.ok(ApiResponse.success("Packing item updated successfully",
                packingItemService.updatePackingItem(itemId, request)));
    }

    @DeleteMapping("/api/v1/admin/packing-items/{itemId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a packing item (Admin)")
    public ResponseEntity<ApiResponse<Void>> deletePackingItem(
            @PathVariable UUID itemId) {

        packingItemService.deletePackingItem(itemId);
        return ResponseEntity.ok(ApiResponse.success("Packing item deleted successfully"));
    }
}
