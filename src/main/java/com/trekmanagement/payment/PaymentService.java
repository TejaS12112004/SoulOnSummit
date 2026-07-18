package com.trekmanagement.payment;

import com.trekmanagement.booking.Booking;
import com.trekmanagement.payment.dto.VerifyPaymentRequest;
import com.trekmanagement.payment.dto.WebhookPayload;

public interface PaymentService {

    String initializePayment(Booking booking);

    void verifyPayment(VerifyPaymentRequest request);

    void handleWebhook(WebhookPayload payload, String signature);
}
