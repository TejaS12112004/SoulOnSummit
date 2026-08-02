package com.trekmanagement.user;

import com.trekmanagement.user.dto.UserResponse;
import com.trekmanagement.user.dto.AdminUserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "role.name", target = "role")
    @Mapping(source = "notifyBookingUpdates", target = "notifyBookingUpdates")
    @Mapping(source = "notifyUpcomingTreks", target = "notifyUpcomingTreks")
    @Mapping(source = "notifyPromotions", target = "notifyPromotions")
    UserResponse toResponse(User user);

    @Mapping(source = "role.name", target = "role")
    @Mapping(target = "authMethod", expression = "java(user.getProviderId() != null ? \"Google\" : \"Local\")")
    AdminUserResponse toAdminResponse(User user);
}
