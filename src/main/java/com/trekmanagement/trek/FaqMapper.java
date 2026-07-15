package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.FaqResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FaqMapper {

    @Mapping(target = "trekId", source = "trek.id")
    FaqResponse toResponse(Faq faq);

    List<FaqResponse> toResponseList(List<Faq> faqs);
}
