package com.trekmanagement.auth;

import com.trekmanagement.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "registration_otps")
public class RegistrationOtp extends BaseEntity {

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "otp", nullable = false, length = 10)
    private String otp;

    @Column(name = "verified", nullable = false)
    private boolean verified = false;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    public RegistrationOtp(String email, String otp, Instant expiresAt) {
        this.email = email.toLowerCase().strip();
        this.otp = otp;
        this.expiresAt = expiresAt;
    }
}
