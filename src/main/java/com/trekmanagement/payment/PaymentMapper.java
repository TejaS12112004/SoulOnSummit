package com.trekmanagement.payment;

import com.trekmanagement.payment.dto.PaymentResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    PaymentResponse toResponse(Payment payment);
}
