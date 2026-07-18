package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.InclusionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InclusionMapper {

    @Mapping(target = "trekId", source = "trek.id")
    InclusionResponse toResponse(TrekInclusion inclusion);

    List<InclusionResponse> toResponseList(List<TrekInclusion> inclusions);
}
