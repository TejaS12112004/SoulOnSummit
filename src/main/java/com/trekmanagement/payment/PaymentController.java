package com.trekmanagement.payment;

import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.config.RazorpayConfig;
import com.trekmanagement.payment.dto.VerifyPaymentRequest;
import com.trekmanagement.payment.dto.WebhookPayload;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final RazorpayConfig razorpayConfig;

    @PostMapping("/payments/verify")
    public ApiResponse<Void> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        paymentService.verifyPayment(request);
        return ApiResponse.success("Payment verified and booking confirmed successfully", null);
    }

    /**
     * Razorpay Webhook.
     * Must be completely unauthenticated (permit all).
     */
    @PostMapping("/webhooks/razorpay")
    public void handleRazorpayWebhook(
            @RequestHeader("X-Razorpay-Signature") String signature,
            @RequestBody WebhookPayload payload) {

        // Note: In a real-world scenario, you MUST verify the webhook signature here using raw body bytes.
        // Spring's @RequestBody has already parsed it to an object.
        // For production, you'd typically implement a filter or interceptor to cache the raw body for HMAC verification.
        // The service layer handles idempotency and state changes.

        paymentService.handleWebhook(payload, signature);
    }
}
