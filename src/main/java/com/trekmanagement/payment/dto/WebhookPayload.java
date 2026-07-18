package com.trekmanagement.payment.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class WebhookPayload {

    private String event;
    private Payload payload;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Payload {
        private PaymentEntity payment;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PaymentEntity {
        private PaymentDetails entity;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PaymentDetails {
        private String id;
        private String entity;
        private Long amount;
        private String currency;
        private String status;
        
        @JsonProperty("order_id")
        private String orderId;
        
        private String method;
        private String description;
    }
}
