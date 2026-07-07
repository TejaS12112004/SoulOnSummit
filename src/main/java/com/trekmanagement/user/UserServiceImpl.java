package com.trekmanagement.user;

import com.trekmanagement.common.exception.ConflictException;
import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.user.dto.ChangePasswordRequest;
import com.trekmanagement.user.dto.UpdateProfileRequest;
import com.trekmanagement.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

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
    public void updateProfileImage(UUID userId, String imageUrl) {
        User user = findById(userId);
        user.setProfileImageUrl(imageUrl);
        userRepository.save(user);
    }

    // ── private helpers ──────────────────────────────────────────────────────

    private User findById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }
}
