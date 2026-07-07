package com.trekmanagement.auth;

import com.trekmanagement.auth.dto.*;
import com.trekmanagement.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Registration, login, token management, password reset")
public class AuthController {

    private final AuthService authService;

    /**
     * Flow 1 — POST /api/v1/auth/register
     * Register a new user account. Sends verification email.
     * Returns 201 Created.
     */
    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid @RequestBody RegisterRequest request) {

        authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful. Please verify your email."));
    }

    /**
     * Flow 2 — GET /api/v1/auth/verify
     * Verify email address using token from verification email.
     */
    @GetMapping("/verify")
    @Operation(summary = "Verify email address")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(
            @RequestParam("token") String token) {

        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully. You can now log in."));
    }

    /**
     * Flow 3 — POST /api/v1/auth/login
     * Authenticate user. Issues access token + refresh token.
     */
    @PostMapping("/login")
    @Operation(summary = "Login and receive JWT tokens")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }

    /**
     * Flow 5 — POST /api/v1/auth/refresh
     * Rotate refresh token. Issues new access + refresh pair.
     * Old refresh token is revoked.
     */
    @PostMapping("/refresh")
    @Operation(summary = "Rotate refresh token and issue new access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @Valid @RequestBody RefreshRequest request) {

        AuthResponse authResponse = authService.refresh(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }

    /**
     * Flow 6 — POST /api/v1/auth/logout
     * Revoke refresh token. Frontend clears access token from memory.
     */
    @PostMapping("/logout")
    @Operation(summary = "Logout — revoke refresh token")
    public ResponseEntity<ApiResponse<Void>> logout(
            @Valid @RequestBody RefreshRequest request) {

        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully."));
    }

    /**
     * Flow 7a — POST /api/v1/auth/forgot-password
     * Initiate password reset. Always returns 200 (ambiguous by design).
     */
    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset email")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(request.getEmail());
        // Ambiguous response — never reveals whether email exists
        return ResponseEntity.ok(ApiResponse.success(
                "If an account with that email exists, a reset link has been sent."));
    }

    /**
     * Flow 7b — POST /api/v1/auth/reset-password
     * Complete password reset using token from email.
     */
    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using token from email")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset successful. Please log in."));
    }
}
