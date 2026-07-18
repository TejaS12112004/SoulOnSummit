package com.trekmanagement.booking.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class CreateBookingRequest {

    @NotNull(message = "Departure ID is required")
    private UUID departureId;

    @NotEmpty(message = "At least one participant is required")
    @Valid
    private List<BookingParticipantRequest> participants;

    private String specialRequests;
}
