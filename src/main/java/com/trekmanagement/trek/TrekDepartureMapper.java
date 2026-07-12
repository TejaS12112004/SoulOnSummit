package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.DepartureResponse;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TrekDepartureMapper {

    @Mapping(target = "trekId",       source = "trek.id")
    @Mapping(target = "active",       source = "active")
    @Mapping(target = "isFillingFast", ignore = true)
    @Mapping(target = "isSoldOut",     ignore = true)
    DepartureResponse toResponse(TrekDeparture departure);

    List<DepartureResponse> toResponseList(List<TrekDeparture> departures);

    /**
     * Computes transient derived flags after the main mapping is complete.
     *
     * isFillingFast: seats remain but <= 30% of total capacity.
     * isSoldOut:     no seats remain.
     *
     * These flags are computed here so that TrekDepartureServiceImpl
     * does not need to touch the response builder; every caller that uses
     * the mapper automatically gets correct derived values.
     */
    @AfterMapping
    default void computeDerivedFlags(TrekDeparture source,
                                     @MappingTarget DepartureResponse.DepartureResponseBuilder target) {
        int available = source.getAvailableSeats() != null ? source.getAvailableSeats() : 0;
        int total     = source.getTotalSeats()     != null ? source.getTotalSeats()     : 0;

        boolean soldOut     = available == 0;
        boolean fillingFast = !soldOut && total > 0 && available <= (int) Math.ceil(total * 0.30);

        target.isSoldOut(soldOut);
        target.isFillingFast(fillingFast);
    }
}
