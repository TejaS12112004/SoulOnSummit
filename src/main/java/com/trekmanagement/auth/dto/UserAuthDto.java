package com.trekmanagement.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserAuthDto {
    private final UUID id;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final List<String> roles;
    private final boolean emailVerified;
    private final Instant createdAt;
}
