package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.ItineraryDayResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ItineraryDayMapper {

    @Mapping(target = "trekId", source = "trek.id")
    ItineraryDayResponse toResponse(TrekItineraryDay day);

    List<ItineraryDayResponse> toResponseList(List<TrekItineraryDay> days);
}
