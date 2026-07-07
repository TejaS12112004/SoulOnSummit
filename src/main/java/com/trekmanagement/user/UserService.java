package com.trekmanagement.user;

import com.trekmanagement.user.dto.ChangePasswordRequest;
import com.trekmanagement.user.dto.UpdateProfileRequest;
import com.trekmanagement.user.dto.UserResponse;

import java.util.UUID;

public interface UserService {

    UserResponse getProfile(UUID userId);

    UserResponse updateProfile(UUID userId, UpdateProfileRequest request);

    void changePassword(UUID userId, ChangePasswordRequest request);

    void updateProfileImage(UUID userId, String imageUrl);
}
