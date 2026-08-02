package com.trekmanagement.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OAuth2ExchangeRequest {
    @NotBlank(message = "Code is required")
    private String code;
}
