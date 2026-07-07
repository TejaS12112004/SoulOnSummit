package com.trekmanagement.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

import java.time.Instant;
import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public final class ErrorResponse {

    private final int status;
    private final String error;
    private final String message;
    private final Instant timestamp;
    private final List<FieldError> errors;

    private ErrorResponse(int status, String error, String message, List<FieldError> errors) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.timestamp = Instant.now();
        this.errors = errors;
    }

    public static ErrorResponse of(int status, String error, String message) {
        return new ErrorResponse(status, error, message, null);
    }

    public static ErrorResponse withFieldErrors(int status, String error, String message, List<FieldError> errors) {
        return new ErrorResponse(status, error, message, errors);
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
