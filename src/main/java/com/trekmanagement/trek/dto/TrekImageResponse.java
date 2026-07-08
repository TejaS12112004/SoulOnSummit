package com.trekmanagement.trek.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class TrekImageResponse {

    private final UUID id;
    private final String imageUrl;
    private final String caption;
    private final int displayOrder;
}
