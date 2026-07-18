package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.HighlightResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface HighlightMapper {

    @Mapping(target = "trekId", source = "trek.id")
    HighlightResponse toResponse(TrekHighlight highlight);

    List<HighlightResponse> toResponseList(List<TrekHighlight> highlights);
}
