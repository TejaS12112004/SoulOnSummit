package com.trekmanagement.trek.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateFaqRequest {

    @NotBlank(message = "Question is required")
    private String question;

    @NotBlank(message = "Answer is required")
    private String answer;

    /**
     * If not provided, defaults to 0 (service layer).
     */
    @Min(value = 0, message = "Display order must be non-negative")
    private Integer displayOrder;
}
