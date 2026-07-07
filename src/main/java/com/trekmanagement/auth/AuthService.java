package com.trekmanagement.auth;

import com.trekmanagement.auth.dto.*;

public interface AuthService {

    /**
     * Flow 1: Register new user, send verification email.
     * Returns 201 — body contains confirmation message only (no tokens yet).
     */
    void register(RegisterRequest request);

    /**
     * Flow 2: Verify email address using the token from the verification email.
     */
    void verifyEmail(String token);

    /**
     * Flow 3: Authenticate user, issue access + refresh tokens.
     * Requires email_verified = true.
     */
    AuthResponse login(LoginRequest request);

    /**
     * Flow 5: Rotate refresh token — invalidate old, issue new access + refresh pair.
     */
    AuthResponse refresh(String rawRefreshToken);

    /**
     * Flow 6: Revoke refresh token, clear session.
     */
    void logout(String rawRefreshToken);

    /**
     * Flow 7a: Initiate password reset — send reset email.
     * Always returns 200 regardless of whether email exists (ambiguous by design).
     */
    void forgotPassword(String email);

    /**
     * Flow 7b: Complete password reset using token from email.
     */
    void resetPassword(ResetPasswordRequest request);
}
