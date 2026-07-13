package com.trekmanagement.storage;

import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.storage.dto.DeleteFileRequest;
import com.trekmanagement.storage.dto.DeleteFileResponse;
import com.trekmanagement.storage.dto.UploadResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

/**
 * Generic file storage endpoints (Supabase-backed). Fully decoupled from Trek —
 * see {@link StorageServiceImpl}'s class-level Javadoc for the reasoning.
 * All routes already fall under the existing /api/v1/admin/** -> ROLE_ADMIN
 * rule in SecurityConfig; no security configuration change was required.
 */
@Validated
@RestController
@RequiredArgsConstructor
@Tag(name = "Storage", description = "File upload/delete via Supabase Storage")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
public class StorageController {

    private final StorageService storageService;

    @PostMapping(value = "/api/v1/admin/storage/treks/{trekId}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a trek cover image (Admin)")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadTrekCover(
            @PathVariable UUID trekId,
            @NotNull(message = "File is required") @RequestParam("file") MultipartFile file) {

        UploadResponse response = storageService.uploadTrekCover(trekId, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Cover image uploaded successfully", response));
    }

    @PostMapping(value = "/api/v1/admin/storage/treks/{trekId}/gallery", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a trek gallery image (Admin)")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadTrekGalleryImage(
            @PathVariable UUID trekId,
            @NotNull(message = "File is required") @RequestParam("file") MultipartFile file) {

        UploadResponse response = storageService.uploadTrekGalleryImage(trekId, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Gallery image uploaded successfully", response));
    }

    @PostMapping(value = "/api/v1/admin/storage/treks/{trekId}/itinerary", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a trek itinerary PDF (Admin)")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadTrekItinerary(
            @PathVariable UUID trekId,
            @NotNull(message = "File is required") @RequestParam("file") MultipartFile file) {

        UploadResponse response = storageService.uploadTrekItinerary(trekId, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Itinerary PDF uploaded successfully", response));
    }

    @DeleteMapping("/api/v1/admin/storage")
    @Operation(summary = "Delete a file by bucket + path (Admin)")
    public ResponseEntity<ApiResponse<DeleteFileResponse>> deleteFile(
            @Valid @RequestBody DeleteFileRequest request) {

        DeleteFileResponse response = storageService.deleteFile(request.getBucket(), request.getPath());
        return ResponseEntity.ok(ApiResponse.success("File deleted successfully", response));
    }
}
