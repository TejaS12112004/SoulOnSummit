package com.trekmanagement.trek.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

/**
 * Partial update — only non-null fields are applied.
 */
@Getter
@Setter
public class UpdateFaqRequest {

    private String question;

    private String answer;

    @Min(value = 0, message = "Display order must be non-negative")
    private Integer displayOrder;
}
