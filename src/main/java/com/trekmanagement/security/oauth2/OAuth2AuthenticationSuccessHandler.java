package com.trekmanagement.security.oauth2;

import com.trekmanagement.auth.OAuth2Code;
import com.trekmanagement.auth.OAuth2CodeRepository;
import com.trekmanagement.common.exception.UnauthorizedException;
import com.trekmanagement.user.Role;
import com.trekmanagement.user.RoleRepository;
import com.trekmanagement.user.User;
import com.trekmanagement.user.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final OAuth2CodeRepository oAuth2CodeRepository;
    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            log.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        String email = oAuth2User.getAttribute("email");
        Boolean emailVerified = oAuth2User.getAttribute("email_verified");
        String providerId = oAuth2User.getAttribute("sub");
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");

        if (email == null || email.isEmpty()) {
            return UriComponentsBuilder.fromUriString(frontendUrl + "/login")
                    .queryParam("error", "oauth2_missing_email")
                    .build().toUriString();
        }
        
        if (!Boolean.TRUE.equals(emailVerified)) {
            return UriComponentsBuilder.fromUriString(frontendUrl + "/login")
                    .queryParam("error", "oauth2_unverified_email")
                    .build().toUriString();
        }

        // Default names if missing
        if (firstName == null) firstName = "User";
        if (lastName == null) lastName = "";

        // First try to find by permanent identity (providerId)
        Optional<User> userByProvider = userRepository.findByProviderId(providerId);
        User user;

        if (userByProvider.isPresent()) {
            user = userByProvider.get();
            // Optional: update email if it changed on Google's side
            if (!user.getEmail().equalsIgnoreCase(email)) {
                user.setEmail(email.toLowerCase().strip());
                user = userRepository.save(user);
            }
        } else {
            // Not found by providerId, check if email exists (local account)
            Optional<User> userOptional = userRepository.findByEmail(email.toLowerCase().strip());
            
            if (userOptional.isPresent()) {
                user = userOptional.get();
                // Link account if providerId is missing
                if (user.getProviderId() == null) {
                    user.setProviderId(providerId);
                    // Trust Google's verification
                    user.setEmailVerified(true);
                    user = userRepository.save(user);
                } else {
                    // Email matches, but providerId is DIFFERENT.
                    // DO NOT OVERWRITE! 
                    return UriComponentsBuilder.fromUriString(frontendUrl + "/login")
                            .queryParam("error", "oauth2_email_taken_by_another_provider")
                            .build().toUriString();
                }
            } else {
                // New user registration
                Role role = roleRepository.findByName("ROLE_USER")
                        .orElseThrow(() -> new IllegalStateException("ROLE_USER not found"));
                
                user = new User();
                user.setRole(role);
                user.setFirstName(firstName);
                user.setLastName(lastName);
                user.setEmail(email.toLowerCase().strip());
                user.setProviderId(providerId);
                user.setEmailVerified(true);
                user.setActive(true);
                user.setPasswordHash(null); // Explicitly null for OAuth2
                
                user = userRepository.save(user);
            }
        }

        if (!user.isActive()) {
            return UriComponentsBuilder.fromUriString(frontendUrl + "/login")
                    .queryParam("error", "account_disabled")
                    .build().toUriString();
        }

        // Generate one-time short-lived authorization code (60 seconds)
        String rawCode = generateSecureToken();
        String codeHash = hashToken(rawCode);
        
        OAuth2Code codeEntity = new OAuth2Code(user, codeHash, Instant.now().plusSeconds(60));
        oAuth2CodeRepository.save(codeEntity);

        return UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/callback")
                .queryParam("code", rawCode)
                .build().toUriString();
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    }

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
}
