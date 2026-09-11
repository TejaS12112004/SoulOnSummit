package com.trekmanagement.auth;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "registration_otps")
@EntityListeners(AuditingEntityListener.class)
public class RegistrationOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "otp", nullable = false, length = 10)
    private String otp;

    @Column(name = "verified", nullable = false)
    private boolean verified = false;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public RegistrationOtp(String email, String otp, Instant expiresAt) {
        this.email = email.toLowerCase().strip();
        this.otp = otp;
        this.expiresAt = expiresAt;
    }
}
