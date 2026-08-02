package com.trekmanagement.auth;

import com.trekmanagement.auth.dto.*;
import com.trekmanagement.common.exception.ConflictException;
import com.trekmanagement.common.exception.UnauthorizedException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.common.util.DateTimeUtils;
import com.trekmanagement.config.JwtConfig;
import com.trekmanagement.config.MailConfig;
import com.trekmanagement.security.JwtTokenProvider;
import com.trekmanagement.user.Role;
import com.trekmanagement.user.RoleRepository;
import com.trekmanagement.user.User;
import com.trekmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final String ROLE_USER = "ROLE_USER";
    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final OAuth2CodeRepository oAuth2CodeRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtConfig jwtConfig;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JavaMailSender mailSender;
    private final MailConfig mailConfig;
    
    @Value("${app.frontend-url}")
    private String frontendUrl;

    // ── Flow 1: Registration ─────────────────────────────────────────────────

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("An account with this email already exists");
        }

        if (request.getPhone() != null && userRepository.existsByPhone(request.getPhone())) {
            throw new ConflictException("An account with this phone number already exists");
        }

        Role role = roleRepository.findByName(ROLE_USER)
                .orElseThrow(() -> new IllegalStateException("Default role ROLE_USER not found — check seeded data"));

        User user = new User();
        user.setRole(role);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail().toLowerCase().strip());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEmailVerified(false);
        user.setActive(true);

        User saved = userRepository.save(user);

        String verificationToken = generateSecureToken();
        EmailVerificationToken evToken = new EmailVerificationToken(
                saved,
                verificationToken,
                DateTimeUtils.nowPlusHours(24)
        );
        emailVerificationTokenRepository.save(evToken);

        sendVerificationEmailAsync(saved.getEmail(), saved.getFirstName(), verificationToken);

        log.info("User registered: {}", saved.getEmail());
    }

    // ── Flow 2: Email verification ───────────────────────────────────────────

    @Override
    @Transactional
    public void verifyEmail(String token) {
        EmailVerificationToken evToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new ValidationException("Invalid or expired verification token"));

        if (DateTimeUtils.isExpired(evToken.getExpiresAt())) {
            emailVerificationTokenRepository.delete(evToken);
            throw new ValidationException("Verification token has expired — please request a new one");
        }

        User user = evToken.getUser();
        userRepository.markEmailVerified(user.getId());

        // Single-use: delete after consumption
        emailVerificationTokenRepository.delete(evToken);

        log.info("Email verified for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void resendVerification(ResendVerificationRequest request) {
        String email = request.getEmail().toLowerCase().strip();
        
        // Return silently if user not found to prevent email enumeration
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.isEmailVerified()) {
            return;
        }

        // Delete any existing tokens to keep only one active
        emailVerificationTokenRepository.deleteAllByUserId(user.getId());

        String verificationToken = generateSecureToken();
        EmailVerificationToken evToken = new EmailVerificationToken(
                user,
                verificationToken,
                DateTimeUtils.nowPlusHours(24)
        );
        emailVerificationTokenRepository.save(evToken);

        sendVerificationEmailAsync(user.getEmail(), user.getFirstName(), verificationToken);
        log.info("Resent verification email for user: {}", user.getEmail());
    }

    // ── Flow 3: Login ────────────────────────────────────────────────────────

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().strip();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        // Check account state before attempting authentication
        if (!user.isActive()) {
            throw new UnauthorizedException("Account is disabled — contact support");
        }

        if (user.getFailedAttempts() >= MAX_FAILED_ATTEMPTS) {
            throw new UnauthorizedException("Account is locked due to too many failed attempts — contact support");
        }

        if (!user.isEmailVerified()) {
            throw new UnauthorizedException("Email not verified — please check your inbox");
        }

        if (user.getPasswordHash() == null) {
            throw new UnauthorizedException("This account uses Google Login. Please sign in with Google.");
        }

        // Delegate to Spring Security (BCrypt comparison)
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        } catch (Exception ex) {
            userRepository.incrementFailedAttempts(user.getId());
            log.warn("Failed login attempt for: {}", email);
            throw new UnauthorizedException("Invalid email or password");
        }

        // Successful login — reset failure counter and update last_login
        userRepository.resetFailedAttempts(user.getId());
        userRepository.updateLastLogin(user.getId(), Instant.now());

        // Refresh user to pick up updated state for token generation
        User freshUser = userRepository.findById(user.getId()).orElseThrow();

        return buildAuthResponse(freshUser);
    }

    // ── Flow 5: Refresh token rotation ──────────────────────────────────────

    @Override
    @Transactional
    public AuthResponse refresh(String rawRefreshToken) {
        RefreshToken stored = refreshTokenRepository.findByToken(rawRefreshToken)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token — please log in again"));

        if (stored.isRevoked()) {
            // Possible token theft — revoke entire family for this user
            refreshTokenRepository.revokeAllByUserId(stored.getUser().getId());
            log.warn("Revoked refresh token reuse detected for user: {}", stored.getUser().getEmail());
            throw new UnauthorizedException("Refresh token has been revoked — please log in again");
        }

        if (DateTimeUtils.isExpired(stored.getExpiresAt())) {
            refreshTokenRepository.delete(stored);
            throw new UnauthorizedException("Refresh token has expired — please log in again");
        }

        User user = stored.getUser();

        if (!user.isActive() || !user.isEmailVerified()) {
            throw new UnauthorizedException("Account is no longer active");
        }

        // Invalidate current token (rotation — new token issued below)
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        return buildAuthResponse(user);
    }

    // ── Flow 5b: OAuth2 Code Exchange ────────────────────────────────────────

    @Override
    @Transactional
    public AuthResponse exchangeOAuth2Code(String code) {
        // Find code and verify expiry using SHA-256
        String codeHash = hashToken(code);
        OAuth2Code storedCode = oAuth2CodeRepository.findByCodeHash(codeHash)
                .orElseThrow(() -> new UnauthorizedException("Invalid authorization code."));

        if (DateTimeUtils.isExpired(storedCode.getExpiresAt())) {
            oAuth2CodeRepository.consumeCodeById(storedCode.getId()); // Safely delete if expired
            throw new UnauthorizedException("Authorization code has expired. Please log in again.");
        }

        User user = storedCode.getUser();

        if (!user.isActive()) {
            throw new UnauthorizedException("Account is disabled — contact support");
        }

        // Atomically consume code
        int deletedRows = oAuth2CodeRepository.consumeCodeById(storedCode.getId());
        if (deletedRows == 0) {
            throw new UnauthorizedException("Authorization code has already been consumed or expired.");
        }
        
        // Update last login
        userRepository.updateLastLogin(user.getId(), Instant.now());
        User freshUser = userRepository.findById(user.getId()).orElseThrow();

        return buildAuthResponse(freshUser);
    }

    // ── Flow 6: Logout ───────────────────────────────────────────────────────

    @Override
    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokenRepository.findByToken(rawRefreshToken).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
            log.info("User logged out: {}", token.getUser().getEmail());
        });
        // No error if token not found — idempotent logout
    }

    // ── Flow 7a: Forgot password ─────────────────────────────────────────────

    @Override
    @Transactional
    public void forgotPassword(String email) {
        // Always return 200 — do not reveal whether email exists (security architecture doc)
        userRepository.findByEmail(email.toLowerCase().strip()).ifPresentOrElse(user -> {
            // Delete any existing reset tokens for this user (single active token policy)
            passwordResetTokenRepository.deleteAllByUserId(user.getId());

            String resetToken = generateSecureToken();
            String hashedToken = hashToken(resetToken);
            PasswordResetToken prt = new PasswordResetToken(
                    user,
                    hashedToken,
                    DateTimeUtils.nowPlusHours(1)  // 1h expiry per security architecture
            );
            passwordResetTokenRepository.save(prt);

            sendPasswordResetEmailAsync(user.getEmail(), user.getFirstName(), resetToken);
            log.info("Password reset email sent to {}", user.getEmail());
        }, () -> {
            log.warn("Forgot password requested for non-existent email: {}", email);
        });
    }

    // ── Flow 7b: Reset password ──────────────────────────────────────────────

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ValidationException("Passwords do not match");
        }

        String hashedToken = hashToken(request.getToken());
        PasswordResetToken prt = passwordResetTokenRepository.findByToken(hashedToken)
                .orElseThrow(() -> new ValidationException("Invalid or expired reset token"));

        if (DateTimeUtils.isExpired(prt.getExpiresAt())) {
            passwordResetTokenRepository.delete(prt);
            throw new ValidationException("Reset token has expired — please request a new one");
        }

        User user = prt.getUser();

        if (user.getPasswordHash() != null && passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new ValidationException("New password must differ from the current password");
        }

        userRepository.updatePasswordHash(user.getId(), passwordEncoder.encode(request.getNewPassword()));

        // Single-use: delete token after consumption
        passwordResetTokenRepository.delete(prt);

        // Revoke all active refresh tokens — force re-login after password change
        refreshTokenRepository.revokeAllByUserId(user.getId());

        log.info("Password reset completed for user: {}", user.getEmail());
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), user.getRole().getName());

        String rawRefreshToken = generateSecureToken();
        RefreshToken refreshToken = new RefreshToken(
                user,
                rawRefreshToken,
                DateTimeUtils.nowPlusDays(jwtConfig.getRefreshTokenExpiryDays())
        );
        refreshTokenRepository.save(refreshToken);

        UserAuthDto userDto = UserAuthDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .profileImageUrl(user.getProfileImageUrl())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .emergencyContactName(user.getEmergencyContactName())
                .emergencyContactPhone(user.getEmergencyContactPhone())
                .address(user.getAddress())
                .city(user.getCity())
                .state(user.getState())
                .country(user.getCountry())
                .postalCode(user.getPostalCode())
                .roles(java.util.List.of(user.getRole().getName()))
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(jwtConfig.getAccessTokenExpiryMs() / 1000)
                .refreshToken(rawRefreshToken)
                .user(userDto)
                .build();
    }

    /**
     * Cryptographically secure 48-byte URL-safe token string (~64 chars).
     */
    private String generateSecureToken() {
        byte[] bytes = new byte[48];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash token", e);
        }
    }

    // ── Async email senders ───────────────────────────────────────────────────

    @Async("notificationExecutor")
    public void sendVerificationEmailAsync(String to, String firstName, String token) {
        try {
            String verifyUrl = mailConfig.getBaseUrl() + "/verify?token=" + token;
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailConfig.getFromAddress());
            message.setTo(to);
            message.setSubject("Verify your email — " + mailConfig.getFromName());
            message.setText(
                "Hi " + firstName + ",\n\n"
                + "Please verify your email address by clicking the link below:\n\n"
                + verifyUrl + "\n\n"
                + "This link expires in 24 hours.\n\n"
                + "If you did not create an account, you can safely ignore this email.\n\n"
                + "— " + mailConfig.getFromName()
            );
            mailSender.send(message);
        } catch (Exception ex) {
            log.error("Failed to send verification email to {}: {}", to, ex.getMessage());
        }
    }

    @Async("notificationExecutor")
    public void sendPasswordResetEmailAsync(String to, String firstName, String token) {
        try {
            String resetUrl = frontendUrl + "/reset-password?token=" + token;
            
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, "utf-8");
            
            helper.setFrom(mailConfig.getFromAddress(), mailConfig.getFromName());
            helper.setTo(to);
            helper.setSubject("Reset your password — SoulOnSummit");
            
            String htmlMsg = "<div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;'>"
                           + "<h2 style='color: #F59E0B;'>SoulOnSummit</h2>"
                           + "<h3>Reset your password</h3>"
                           + "<p>Hi " + (firstName != null ? firstName : "") + ",</p>"
                           + "<p>We received a request to reset the password for your SoulOnSummit account.</p>"
                           + "<p style='margin: 30px 0;'>"
                           + "<a href='" + resetUrl + "' style='background-color: #F59E0B; color: #1C2B3A; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;'>Reset Password</a>"
                           + "</p>"
                           + "<p>This link will expire in 1 hour.</p>"
                           + "<p>If you didn't request this password reset, you can safely ignore this email.</p>"
                           + "<hr style='border: none; border-top: 1px solid #eaeaea; margin-top: 30px;' />"
                           + "<p style='color: #888; font-size: 12px;'>SoulOnSummit<br/>Adventure awaits.</p>"
                           + "</div>";
            
            helper.setText(htmlMsg, true);
            mailSender.send(mimeMessage);
        } catch (Exception ex) {
            log.error("Failed to send password reset email to {}: {}", to, ex.getMessage());
        }
    }
}
