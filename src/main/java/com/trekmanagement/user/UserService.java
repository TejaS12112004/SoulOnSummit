package com.trekmanagement.user;

import com.trekmanagement.user.dto.ChangePasswordRequest;
import com.trekmanagement.user.dto.UpdatePreferencesRequest;
import com.trekmanagement.user.dto.UpdateProfileRequest;
import com.trekmanagement.user.dto.UserResponse;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.trekmanagement.user.dto.AdminUserResponse;
import java.util.UUID;

public interface UserService {

    UserResponse getProfile(UUID userId);

    UserResponse updateProfile(UUID userId, UpdateProfileRequest request);

    void changePassword(UUID userId, ChangePasswordRequest request);

    void updateProfileImage(UUID userId, MultipartFile file);

    void updatePreferences(UUID userId, UpdatePreferencesRequest request);

    void deleteAccount(UUID userId);

    Page<AdminUserResponse> searchAdminUsers(String search, Pageable pageable);
}
