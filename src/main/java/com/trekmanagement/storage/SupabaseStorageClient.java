package com.trekmanagement.storage;

import com.trekmanagement.common.exception.FileDeleteException;
import com.trekmanagement.common.exception.StorageException;
import com.trekmanagement.config.SupabaseConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Thin transport layer over the already-configured {@code supabaseWebClient()} bean
 * (see {@link SupabaseConfig}). Contains no validation or business logic — that lives
 * in {@link StorageServiceImpl}. Kept separate so raw HTTP transport and validation
 * policy don't mix in one class.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SupabaseStorageClient {

    private final WebClient supabaseWebClient;
    private final SupabaseConfig supabaseConfig;

    /**
     * Uploads raw bytes to {bucket}/{path} and returns the public URL.
     * Assumes the bucket is public (all buckets used by this module today are).
     */
    public String upload(String bucket, String path, byte[] content, String contentType) {
        try {
            supabaseWebClient.post()
                    .uri("/storage/v1/object/{bucket}/{path}", bucket, path)
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .bodyValue(content)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        } catch (Exception ex) {
            throw new StorageException("Failed to upload file to bucket '" + bucket + "' at path '" + path + "'", ex);
        }

        return buildPublicUrl(bucket, path);
    }

    /**
     * Deletes a single object at {bucket}/{path}.
     */
    public void delete(String bucket, String path) {
        try {
            supabaseWebClient.delete()
                    .uri("/storage/v1/object/{bucket}/{path}", bucket, path)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        } catch (Exception ex) {
            throw new FileDeleteException(
                    "Failed to delete file from bucket '" + bucket + "' at path '" + path + "'", ex);
        }
    }

    private String buildPublicUrl(String bucket, String path) {
        return "%s/storage/v1/object/public/%s/%s".formatted(supabaseConfig.getUrl(), bucket, path);
    }
}
