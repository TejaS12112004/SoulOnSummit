package com.trekmanagement.common.util;

import com.trekmanagement.common.exception.ValidationException;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;
import java.util.UUID;

public final class FileUtils {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp"
    );

    private static final Set<String> ALLOWED_PDF_TYPES = Set.of(
            "application/pdf"
    );

    private static final long MAX_IMAGE_SIZE_BYTES = 10L * 1024 * 1024;  // 10 MB
    private static final long MAX_PDF_SIZE_BYTES   = 20L * 1024 * 1024;  // 20 MB

    private FileUtils() {}

    public static void validateImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ValidationException("Image file must not be empty");
        }
        if (!ALLOWED_IMAGE_TYPES.contains(file.getContentType())) {
            throw new ValidationException("Only JPEG, PNG, and WebP images are allowed");
        }
        if (file.getSize() > MAX_IMAGE_SIZE_BYTES) {
            throw new ValidationException("Image must not exceed 10 MB");
        }
    }

    public static void validatePdf(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ValidationException("PDF file must not be empty");
        }
        if (!ALLOWED_PDF_TYPES.contains(file.getContentType())) {
            throw new ValidationException("Only PDF files are allowed");
        }
        if (file.getSize() > MAX_PDF_SIZE_BYTES) {
            throw new ValidationException("PDF must not exceed 20 MB");
        }
    }

    /**
     * Generates a unique, storage-safe filename retaining the original extension.
     * e.g. "my trek photo.PNG" → "a3f1c9b2-....png"
     */
    public static String generateStorageName(String originalFilename) {
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = "." + originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toLowerCase();
        }
        return UUID.randomUUID() + extension;
    }
}
