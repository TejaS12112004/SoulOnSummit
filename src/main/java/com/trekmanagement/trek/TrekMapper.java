package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.TrekImageResponse;
import com.trekmanagement.trek.dto.TrekResponse;
import com.trekmanagement.trek.dto.TrekSummaryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TrekMapper {

    @Mapping(target = "active", source = "active")
    TrekResponse toResponse(Trek trek);

    TrekSummaryResponse toSummaryResponse(Trek trek);

    @Mapping(target = "id",           source = "id")
    @Mapping(target = "imageUrl",     source = "imageUrl")
    @Mapping(target = "caption",      source = "caption")
    @Mapping(target = "displayOrder", source = "displayOrder")
    TrekImageResponse toImageResponse(TrekImage image);
}
