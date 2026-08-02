package com.trekmanagement.payment;

import com.trekmanagement.payment.dto.PaymentResponse;
import com.trekmanagement.payment.dto.AdminPaymentResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    PaymentResponse toResponse(Payment payment);

    @Mapping(target = "bookingReference", source = "booking.bookingReference")
    @Mapping(target = "userName", expression = "java(payment.getBooking().getUser().getFirstName() + \" \" + payment.getBooking().getUser().getLastName())")
    @Mapping(target = "userEmail", source = "booking.user.email")
    @Mapping(target = "trekTitle", source = "booking.departure.trek.title")
    @Mapping(target = "invoiceUrl", ignore = true) // Will be set in the service layer
    AdminPaymentResponse toAdminResponse(Payment payment);
}
