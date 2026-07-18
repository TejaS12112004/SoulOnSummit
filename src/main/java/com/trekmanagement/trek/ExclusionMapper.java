package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.ExclusionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ExclusionMapper {

    @Mapping(target = "trekId", source = "trek.id")
    ExclusionResponse toResponse(TrekExclusion exclusion);

    List<ExclusionResponse> toResponseList(List<TrekExclusion> exclusions);
}
