package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.PackingItemResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PackingItemMapper {

    @Mapping(target = "trekId", source = "trek.id")
    PackingItemResponse toResponse(TrekPackingItem packingItem);

    List<PackingItemResponse> toResponseList(List<TrekPackingItem> packingItems);
}
