package com.trekmanagement.invoice;

import com.trekmanagement.invoice.dto.InvoiceResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {

    InvoiceResponse toResponse(Invoice invoice);
}
