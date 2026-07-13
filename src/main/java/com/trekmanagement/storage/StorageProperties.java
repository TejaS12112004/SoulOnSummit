package com.trekmanagement.storage;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Storage module's own validation policy — image/PDF size limits and allowed
 * MIME types. Deliberately separate from {@link com.trekmanagement.config.SupabaseConfig},
 * which owns connection details and bucket naming: this class would look the
 * same regardless of which storage provider sits behind {@link StorageService}.
 */
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.storage")
public class StorageProperties {

    /** Maximum allowed size, in bytes, for image uploads (cover/gallery/avatar/blog). */
    private long maxImageSize;

    /** Maximum allowed size, in bytes, for PDF uploads (itinerary/invoice). */
    private long maxPdfSize;

    /** Allowed MIME types for image uploads, e.g. image/jpeg, image/png, image/webp. */
    private List<String> allowedImageMimeTypes;

    /** Allowed MIME types for PDF uploads, e.g. application/pdf. */
    private List<String> allowedPdfMimeTypes;
}
