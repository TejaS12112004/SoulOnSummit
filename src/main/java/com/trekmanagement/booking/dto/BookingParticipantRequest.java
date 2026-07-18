package com.trekmanagement.booking.dto;

import com.trekmanagement.booking.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingParticipantRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Age is required")
    @Min(value = 5, message = "Age must be at least 5")
    private Integer age;

    @NotNull(message = "Gender is required")
    private Gender gender;

    private String phone;
    
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Emergency contact name is required")
    private String emergencyContactName;

    @NotBlank(message = "Emergency contact phone is required")
    private String emergencyContactPhone;

    private String medicalConditions;
    
    private String previousTrekExperience;
}
