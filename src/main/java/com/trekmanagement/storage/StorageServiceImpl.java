package com.trekmanagement.storage;

import com.trekmanagement.common.exception.FileTooLargeException;
import com.trekmanagement.common.exception.InvalidFileTypeException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.config.SupabaseConfig;
import com.trekmanagement.storage.dto.DeleteFileResponse;
import com.trekmanagement.storage.dto.UploadResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Generic Supabase-backed file storage service.
 *
 * IMPORTANT — this class is intentionally decoupled from every business module:
 * it must never query {@code TrekRepository}, never read or write a {@code Trek}
 * or {@code TrekImage} entity, and knows nothing about bookings, users, blogs, or
 * reviews. A {@code trekId} passed into the trek-specific convenience methods below
 * is used ONLY to build a storage folder path — never to look up or validate a
 * Trek record. Callers (e.g. an admin frontend) are responsible for taking the
 * returned {@link UploadResponse#getPublicUrl()} and feeding it into whichever
 * business entity needs it, via that module's own existing endpoints.
 *
 * Every upload path enforces validation in this exact order, all BEFORE any
 * network call to Supabase is made:
 *   1. reject empty files
 *   2. validate file size
 *   3. validate MIME type
 *   4. only then generate the (UUID-based) filename and upload
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StorageServiceImpl implements StorageService {

    private static final Map<String, String> MIME_TO_EXTENSION = Map.of(
            "image/jpeg", "jpg",
            "image/png", "png",
            "image/webp", "webp",
            "application/pdf", "pdf"
    );

    private final SupabaseStorageClient supabaseStorageClient;
    private final SupabaseConfig supabaseConfig;
    private final StorageProperties storageProperties;

    // ═══════════════════════════════════════════════════════════════════════
    // Trek-specific convenience methods — thin wrappers over the generic core.
    // Adding avatars/blog-images/invoices later means adding another one of
    // these; uploadInternal() itself never needs to change.
    // ═══════════════════════════════════════════════════════════════════════

    @Override
    public UploadResponse uploadTrekCover(UUID trekId, MultipartFile file) {
        return uploadInternal(
                supabaseConfig.getStorage().getBucketImages(),
                trekId.toString(),
                file,
                storageProperties.getAllowedImageMimeTypes(),
                storageProperties.getMaxImageSize());
    }

    @Override
    public UploadResponse uploadTrekGalleryImage(UUID trekId, MultipartFile file) {
        return uploadInternal(
                supabaseConfig.getStorage().getBucketGallery(),
                trekId.toString(),
                file,
                storageProperties.getAllowedImageMimeTypes(),
                storageProperties.getMaxImageSize());
    }

    @Override
    public UploadResponse uploadTrekItinerary(UUID trekId, MultipartFile file) {
        return uploadInternal(
                supabaseConfig.getStorage().getBucketItineraries(),
                trekId.toString(),
                file,
                storageProperties.getAllowedPdfMimeTypes(),
                storageProperties.getMaxPdfSize());
    }

    @Override
    public DeleteFileResponse deleteFile(String bucket, String path) {
        String uploader = currentUploader();
        supabaseStorageClient.delete(bucket, path);
        log.info("File deleted — uploader={}, bucket={}, path={}", uploader, bucket, path);

        return DeleteFileResponse.builder()
                .bucket(bucket)
                .path(path)
                .deleted(true)
                .build();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Generic core — bucket/caller-agnostic. This is the reusable seam for
    // every future upload type (avatars, blog images, invoices).
    //
    // NOTE (image processing): resizing/WebP-conversion/thumbnail generation
    // would hook in right here, between validation and the upload call,
    // transforming `content` before it's handed to SupabaseStorageClient.
    // Not implemented yet — this comment marks the seam so the public API
    // (uploadTrekCover/uploadTrekGalleryImage/uploadTrekItinerary/UploadResponse)
    // would not need to change when it is.
    // ═══════════════════════════════════════════════════════════════════════

    private UploadResponse uploadInternal(String bucket, String folder, MultipartFile file,
                                           List<String> allowedMimeTypes, long maxSize) {
        String uploader = currentUploader();
        long startTime = System.currentTimeMillis();

        // 1. Reject empty files
        if (file == null || file.isEmpty()) {
            throw new ValidationException("Uploaded file must not be empty");
        }

        // 2. Validate file size
        if (file.getSize() > maxSize) {
            throw new FileTooLargeException(
                    "File size (" + file.getSize() + " bytes) exceeds the maximum allowed size ("
                            + maxSize + " bytes)");
        }

        // 3. Validate MIME type
        String contentType = file.getContentType();
        if (contentType == null || !allowedMimeTypes.contains(contentType)) {
            throw new InvalidFileTypeException(
                    "File type '" + contentType + "' is not allowed. Allowed types: " + allowedMimeTypes);
        }

        // 4. Only now: generate the filename and upload. Never trust the
        //    client-supplied filename — the extension is derived from the
        //    already-validated MIME type, and the base name is always a
        //    fresh random UUID (every upload gets a unique path, including
        //    cover images and itinerary PDFs — no fixed/overwritable names).
        String extension = MIME_TO_EXTENSION.get(contentType);
        String fileName = UUID.randomUUID() + "." + extension;
        String path = folder + "/" + fileName;

        byte[] content;
        try {
            content = file.getBytes();
        } catch (IOException ex) {
            throw new ValidationException("Unable to read uploaded file contents");
        }

        String publicUrl = supabaseStorageClient.upload(bucket, path, content, contentType);

        long durationMs = System.currentTimeMillis() - startTime;
        log.info("File uploaded — uploader={}, bucket={}, path={}, size={} bytes, duration={}ms",
                uploader, bucket, path, file.getSize(), durationMs);

        return UploadResponse.builder()
                .bucket(bucket)
                .path(path)
                .publicUrl(publicUrl)
                .fileName(fileName)
                .contentType(contentType)
                .size(file.getSize())
                .build();
    }

    private String currentUploader() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null ? authentication.getName() : "unknown";
    }
}
