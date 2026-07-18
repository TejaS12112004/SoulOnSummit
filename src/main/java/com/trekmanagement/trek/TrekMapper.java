package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.TrekImageResponse;
import com.trekmanagement.trek.dto.TrekResponse;
import com.trekmanagement.trek.dto.TrekSummaryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * MapStruct mapper for Trek → response DTOs.
 *
 * All fields that require business logic or lazy-loaded collections
 * (departures, faqs, itineraryDays, highlights, lowestPrice, nextDepartureDate)
 * are explicitly ignored here. TrekServiceImpl is the single place where
 * a full TrekResponse is assembled — this mapper must not duplicate
 * that responsibility.
 *
 * The only active usage of this mapper in TrekServiceImpl is
 * toImageResponseList(), called inside buildTrekResponse().
 */
@Mapper(componentModel = "spring")
public interface TrekMapper {

    @Mapping(target = "departures",        ignore = true)
    @Mapping(target = "lowestPrice",       ignore = true)
    @Mapping(target = "nextDepartureDate", ignore = true)
    @Mapping(target = "faqs",             ignore = true)
    @Mapping(target = "itineraryDays",         ignore = true)
    @Mapping(target = "highlights",        ignore = true)
    @Mapping(target = "inclusions",        ignore = true)
    @Mapping(target = "exclusions",        ignore = true)
    @Mapping(target = "packingItems",      ignore = true)
    TrekResponse toResponse(Trek trek);

    @Mapping(target = "lowestPrice",                 ignore = true)
    @Mapping(target = "nextDepartureDate",           ignore = true)
    @Mapping(target = "nextDepartureAvailableSeats", ignore = true)
    TrekSummaryResponse toSummaryResponse(Trek trek);

    TrekImageResponse toImageResponse(TrekImage image);

    List<TrekImageResponse> toImageResponseList(List<TrekImage> images);
}
