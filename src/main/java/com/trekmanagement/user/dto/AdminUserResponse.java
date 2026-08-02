package com.trekmanagement.user.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class AdminUserResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String role;
    private boolean emailVerified;
    private boolean active;
    private Instant createdAt;
    private Instant lastLogin;
    private String authMethod;
}
