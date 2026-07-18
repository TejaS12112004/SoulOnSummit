package com.trekmanagement.invoice;

import com.trekmanagement.booking.Booking;
import com.trekmanagement.invoice.dto.InvoiceResponse;

import java.util.UUID;

public interface InvoiceService {

    InvoiceResponse getInvoice(UUID bookingId);

    void generateAndUpload(Booking booking);
}
