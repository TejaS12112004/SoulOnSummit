package com.trekmanagement.booking;

import com.trekmanagement.booking.dto.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    BookingParticipant toParticipantEntity(BookingParticipantRequest request);

    ParticipantResponse toParticipantResponse(BookingParticipant participant);

    @Mapping(target = "departureId", source = "departure.id")
    @Mapping(target = "trekTitle", source = "departure.trek.title")
    @Mapping(target = "startDate", source = "departure.startDate")
    @Mapping(target = "endDate", source = "departure.endDate")
    @Mapping(target = "location", source = "departure.trek.location")
    @Mapping(target = "paymentStatus", expression = "java(booking.getLatestPaymentStatus())")
    BookingResponse toResponse(Booking booking);

    @Mapping(target = "trekTitle", source = "departure.trek.title")
    @Mapping(target = "startDate", source = "departure.startDate")
    @Mapping(target = "paymentStatus", expression = "java(booking.getLatestPaymentStatus())")
    BookingSummaryResponse toSummaryResponse(Booking booking);

    @Mapping(target = "userEmail", source = "user.email")
    @Mapping(target = "userName", source = "user.firstName")
    @Mapping(target = "trekTitle", source = "departure.trek.title")
    @Mapping(target = "startDate", source = "departure.startDate")
    @Mapping(target = "paymentStatus", expression = "java(booking.getLatestPaymentStatus())")
    AdminBookingResponse toAdminResponse(Booking booking);
}
