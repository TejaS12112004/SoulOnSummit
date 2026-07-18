package com.trekmanagement.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

import java.time.Instant;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public final class ApiResponse<T> {

    private final boolean success;
    private final String message;
    private final String errorCode;
    private final T data;
    private final Instant timestamp;
    private final String traceId;

    private ApiResponse(boolean success, String message, String errorCode, T data) {
        this.success = success;
        this.message = message;
        this.errorCode = errorCode;
        this.data = data;
        this.timestamp = Instant.now();
        this.traceId = org.slf4j.MDC.get("traceId");
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, null, null, data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, null, data);
    }

    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    public static <T> ApiResponse<T> failure(String message) {
        return new ApiResponse<>(false, message, null, null);
    }

    public static <T> ApiResponse<T> failure(String message, String errorCode) {
        return new ApiResponse<>(false, message, errorCode, null);
    }
}
