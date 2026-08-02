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
    private final String phone;
    private final String profileImageUrl;
    private final java.time.LocalDate dateOfBirth;
    private final String gender;
    private final String emergencyContactName;
    private final String emergencyContactPhone;
    private final String address;
    private final String city;
    private final String state;
    private final String country;
    private final String postalCode;
    
    private final List<String> roles;
    private final boolean emailVerified;
    private final Instant createdAt;
}
