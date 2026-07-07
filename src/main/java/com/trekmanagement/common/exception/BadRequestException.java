package com.trekmanagement.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// ─────────────────────────────────────────────────────────────────────────────
// 400 Bad Request
// ─────────────────────────────────────────────────────────────────────────────
@ResponseStatus(HttpStatus.BAD_REQUEST)
class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
