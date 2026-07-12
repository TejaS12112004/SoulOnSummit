package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.DepartureResponse;
import com.trekmanagement.trek.dto.TrekImageResponse;
import com.trekmanagement.trek.dto.TrekResponse;
import com.trekmanagement.trek.dto.TrekSummaryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * MapStruct mapper for Trek → response DTOs.
 *
 * lowestPrice, nextDepartureDate, nextDepartureAvailableSeats, and
 * the departures list are NOT mapped here because they require departure
 * data that may or may not be loaded depending on the calling context
 * (public vs admin, list vs detail).
 *
 * TrekServiceImpl builds these derived fields explicitly and passes them
 * into the builder after calling this mapper's structural mapping.
 *
 * This keeps the mapper free of business logic and consistent with the
 * existing project's MapStruct style.
 */
@Mapper(componentModel = "spring", uses = {TrekDepartureMapper.class})
public interface TrekMapper {

    @Mapping(target = "active",              source = "active")
    @Mapping(target = "departures",          ignore = true)
    @Mapping(target = "lowestPrice",         ignore = true)
    @Mapping(target = "nextDepartureDate",   ignore = true)
    TrekResponse toResponse(Trek trek);

    @Mapping(target = "lowestPrice",                  ignore = true)
    @Mapping(target = "nextDepartureDate",            ignore = true)
    @Mapping(target = "nextDepartureAvailableSeats",  ignore = true)
    TrekSummaryResponse toSummaryResponse(Trek trek);

    @Mapping(target = "id",           source = "id")
    @Mapping(target = "imageUrl",     source = "imageUrl")
    @Mapping(target = "caption",      source = "caption")
    @Mapping(target = "displayOrder", source = "displayOrder")
    TrekImageResponse toImageResponse(TrekImage image);

    List<TrekImageResponse> toImageResponseList(List<TrekImage> images);
}
