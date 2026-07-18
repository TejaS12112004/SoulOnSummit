package com.trekmanagement.invoice.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class InvoiceResponse {
    private UUID id;
    private String invoiceNumber;
    private String invoiceUrl;
    private LocalDate issueDate;
    private BigDecimal totalAmount;
    private BigDecimal gstAmount;
}
