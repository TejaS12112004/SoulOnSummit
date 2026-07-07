package com.trekmanagement.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {

    private final String accessToken;
    private final String tokenType;
    private final long expiresIn;          // seconds
    private final String refreshToken;     // opaque UUID string
    private final UUID userId;
    private final String email;
    private final String role;
    private final String firstName;
    private final String lastName;
}
