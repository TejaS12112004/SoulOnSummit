package com.trekmanagement.user;

import com.trekmanagement.common.exception.ConflictException;
import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.user.dto.ChangePasswordRequest;
import com.trekmanagement.user.dto.UpdatePreferencesRequest;
import com.trekmanagement.user.dto.UpdateProfileRequest;
import com.trekmanagement.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.trekmanagement.storage.StorageService;
import com.trekmanagement.storage.dto.UploadResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.trekmanagement.user.dto.AdminUserResponse;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final StorageService storageService;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getProfile(UUID userId) {
        User user = findById(userId);
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = findById(userId);

        // Phone uniqueness check — only if changing
        if (request.getPhone() != null
                && !request.getPhone().equals(user.getPhone())
                && userRepository.existsByPhone(request.getPhone())) {
            throw new ConflictException("Phone number is already registered to another account");
        }

        if (request.getFirstName() != null)            user.setFirstName(request.getFirstName());
        if (request.getLastName() != null)             user.setLastName(request.getLastName());
        if (request.getPhone() != null)                user.setPhone(request.getPhone());
        if (request.getDateOfBirth() != null)          user.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null)               user.setGender(request.getGender());
        if (request.getEmergencyContactName() != null) user.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactPhone() != null) user.setEmergencyContactPhone(request.getEmergencyContactPhone());
        if (request.getAddress() != null)              user.setAddress(request.getAddress());
        if (request.getCity() != null)                 user.setCity(request.getCity());
        if (request.getState() != null)                user.setState(request.getState());
        if (request.getCountry() != null)              user.setCountry(request.getCountry());
        if (request.getPostalCode() != null)           user.setPostalCode(request.getPostalCode());

        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ValidationException("New password and confirmation do not match");
        }

        User user = findById(userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new ValidationException("Current password is incorrect");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new ValidationException("New password must differ from the current password");
        }

        userRepository.updatePasswordHash(userId, passwordEncoder.encode(request.getNewPassword()));
    }

    @Override
    @Transactional
    public void updateProfileImage(UUID userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UploadResponse response = storageService.uploadUserAvatar(userId, file);
        user.setProfileImageUrl(response.getPublicUrl());
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updatePreferences(UUID userId, UpdatePreferencesRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setNotifyBookingUpdates(request.isNotifyBookingUpdates());
        user.setNotifyUpcomingTreks(request.isNotifyUpcomingTreks());
        user.setNotifyPromotions(request.isNotifyPromotions());

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteAccount(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Soft delete logic: deactivate account and anonymize PII if needed
        user.setActive(false);
        user.setEmail(user.getEmail() + "_deleted_" + Instant.now().toEpochMilli()); // To free up email for re-registration
        // Optional: clear phone, address, etc.
        
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserResponse> searchAdminUsers(String search, Pageable pageable) {
        Page<User> page = userRepository.searchUsers(search, pageable);
        return page.map(userMapper::toAdminResponse);
    }

    // ── private helpers ──────────────────────────────────────────────────────

    private User findById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }
}
