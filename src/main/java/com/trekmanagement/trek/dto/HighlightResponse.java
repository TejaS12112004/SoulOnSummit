package com.trekmanagement.trek.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HighlightResponse {

    private final UUID id;
    private final UUID trekId;

    private final String title;
    private final String description;
    private final String iconName;

    private final Integer displayOrder;

    private final Instant createdAt;
    private final Instant updatedAt;
}
