package com.trekmanagement.storage.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeleteFileRequest {

    @NotBlank(message = "Bucket is required")
    private String bucket;

    @NotBlank(message = "Path is required")
    private String path;
}
