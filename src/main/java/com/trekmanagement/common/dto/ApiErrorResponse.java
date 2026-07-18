package com.trekmanagement.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import org.slf4j.MDC;

import java.time.Instant;
import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public final class ApiErrorResponse {

    private final boolean success = false;
    private final String message;
    private final String errorCode;
    private final Instant timestamp;
    private final String traceId;
    private final List<FieldError> errors;

    private ApiErrorResponse(String message, String errorCode, List<FieldError> errors) {
        this.message = message;
        this.errorCode = errorCode;
        this.errors = errors;
        this.timestamp = Instant.now();
        this.traceId = MDC.get("traceId");
    }

    public static ApiErrorResponse of(String message, String errorCode) {
        return new ApiErrorResponse(message, errorCode, null);
    }

    public static ApiErrorResponse withFieldErrors(String message, String errorCode, List<FieldError> errors) {
        return new ApiErrorResponse(message, errorCode, errors);
    }

    @Getter
    public static final class FieldError {
        private final String field;
        private final String rejectedValue;
        private final String message;

        public FieldError(String field, Object rejectedValue, String message) {
            this.field = field;
            this.rejectedValue = rejectedValue != null ? rejectedValue.toString() : null;
            this.message = message;
        }
    }
}
