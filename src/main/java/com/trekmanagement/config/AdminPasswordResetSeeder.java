package com.trekmanagement.config;

import com.trekmanagement.user.User;
import com.trekmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminPasswordResetSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        String adminEmail = "tekadet10@gmail.com";
        userRepository.findByEmail(adminEmail).ifPresent(user -> {
            log.info("Found admin user {}. Resetting password to 'admin123' and unlocking account...", adminEmail);
            user.setPasswordHash(passwordEncoder.encode("admin123"));
            user.setFailedAttempts(0); // Unlock account
            user.setActive(true);
            user.setEmailVerified(true);
            userRepository.save(user);
            log.info("Admin account successfully reset and unlocked.");
        });
    }
}
