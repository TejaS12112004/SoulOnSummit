package com.trekmanagement.booking.dto;

import com.trekmanagement.booking.Gender;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ParticipantResponse {
    private UUID id;
    private String fullName;
    private Integer age;
    private Gender gender;
    private String phone;
    private String email;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String medicalConditions;
    private String previousTrekExperience;
}
