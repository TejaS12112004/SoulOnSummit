package com.trekmanagement.trek.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Partial update — only non-null fields are applied (see HighlightServiceImpl).
 */
@Getter
@Setter
@Size
public class UpdateHighlightRequest {

    private String title;

    private String description;

    private String iconName;

    @Min(value = 0, message = "Display order must be non-negative")
    private Integer displayOrder;
}
