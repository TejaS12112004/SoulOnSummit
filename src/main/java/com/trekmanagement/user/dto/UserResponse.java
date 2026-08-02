package com.trekmanagement.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {

    private final UUID id;
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String phone;
    private final String profileImageUrl;
    private final LocalDate dateOfBirth;
    private final String gender;
    private final String emergencyContactName;
    private final String emergencyContactPhone;
    private final String address;
    private final String city;
    private final String state;
    private final String country;
    private final String postalCode;
    
    // Preferences
    private final boolean notifyBookingUpdates;
    private final boolean notifyUpcomingTreks;
    private final boolean notifyPromotions;

    private final String role;
    private final boolean emailVerified;
    private final Instant lastLogin;
    private final Instant createdAt;
}
