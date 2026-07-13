package com.trekmanagement.storage.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UploadResponse {

    private final String bucket;
    private final String path;
    private final String publicUrl;
    private final String fileName;
    private final String contentType;
    private final long size;
}
