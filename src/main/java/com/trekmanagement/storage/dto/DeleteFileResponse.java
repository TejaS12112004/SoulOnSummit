package com.trekmanagement.storage.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeleteFileResponse {

    private final String bucket;
    private final String path;
    private final boolean deleted;
}
