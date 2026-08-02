package com.trekmanagement.blog.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PublishStatusRequest {
    @NotNull(message = "Published status is required")
    private Boolean published;
}
