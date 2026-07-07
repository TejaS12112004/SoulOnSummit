package com.trekmanagement.user.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateProfileRequest {

    @Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters")
    private String firstName;

    @Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters")
    private String lastName;

    @Pattern(
        regexp = "^[+]?[0-9]{10,15}$",
        message = "Phone must be a valid number (10–15 digits)"
    )
    private String phone;

    private LocalDate dateOfBirth;

    @Size(max = 20)
    private String gender;

    @Size(max = 100)
    private String emergencyContactName;

    @Pattern(
        regexp = "^[+]?[0-9]{10,15}$",
        message = "Emergency phone must be a valid number"
    )
    private String emergencyContactPhone;

    private String address;

    @Size(max = 100)
    private String city;

    @Size(max = 100)
    private String state;

    @Size(max = 100)
    private String country;

    @Size(max = 20)
    private String postalCode;
}
