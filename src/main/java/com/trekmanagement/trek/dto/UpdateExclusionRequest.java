package com.trekmanagement.trek.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateExclusionRequest {

    private String title;

    private String description;

    @Min(value = 0, message = "Display order must be non-negative")
    private Integer displayOrder;
}
