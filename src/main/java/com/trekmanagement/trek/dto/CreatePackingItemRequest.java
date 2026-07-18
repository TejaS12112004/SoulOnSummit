package com.trekmanagement.trek.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePackingItemRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Display order is required")
    @Min(value = 0, message = "Display order must be non-negative")
    private Integer displayOrder;
}
