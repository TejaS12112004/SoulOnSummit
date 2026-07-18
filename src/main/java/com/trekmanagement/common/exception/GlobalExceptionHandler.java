package com.trekmanagement.common.exception;

import com.trekmanagement.common.dto.ApiErrorResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── Validation: @Valid bean errors ──────────────────────────────────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        List<ApiErrorResponse.FieldError> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fe -> new ApiErrorResponse.FieldError(
                        fe.getField(),
                        fe.getRejectedValue(),
                        fe.getDefaultMessage()))
                .toList();

        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY) // 422 for validation
                .body(ApiErrorResponse.withFieldErrors(
                        "Validation Failed",
                        "VALIDATION_FAILED",
                        fieldErrors));
    }

    // ── Validation: @Validated path/query param errors ──────────────────────
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
        List<ApiErrorResponse.FieldError> fieldErrors = ex.getConstraintViolations()
                .stream()
                .map(cv -> new ApiErrorResponse.FieldError(
                        cv.getPropertyPath().toString(),
                        cv.getInvalidValue(),
                        cv.getMessage()))
                .toList();

        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY) // 422 for validation
                .body(ApiErrorResponse.withFieldErrors(
                        "Validation Failed",
                        "VALIDATION_FAILED",
                        fieldErrors));
    }

    // ── Malformed JSON ───────────────────────────────────────────────────────
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiErrorResponse.of("Malformed or unreadable request body", "BAD_REQUEST"));
    }

    // ── Type mismatch (UUID/enum in path) ────────────────────────────────────
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = String.format("Parameter '%s' has invalid value: '%s'", ex.getName(), ex.getValue());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiErrorResponse.of(message, "BAD_REQUEST"));
    }

    // ── Domain exceptions ────────────────────────────────────────────────────
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiErrorResponse.of(ex.getMessage(), "NOT_FOUND"));
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiErrorResponse> handleConflict(ConflictException ex) {
        log.warn("Conflict error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiErrorResponse.of(ex.getMessage(), "CONFLICT"));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(ValidationException ex) {
        log.warn("Validation error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY) // 422
                .body(ApiErrorResponse.of(ex.getMessage(), "VALIDATION_FAILED"));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiErrorResponse.of(ex.getMessage(), "UNAUTHORIZED"));
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiErrorResponse> handleForbidden(ForbiddenException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiErrorResponse.of(ex.getMessage(), "FORBIDDEN"));
    }

    @ExceptionHandler(PaymentException.class)
    public ResponseEntity<ApiErrorResponse> handlePayment(PaymentException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiErrorResponse.of(ex.getMessage(), "PAYMENT_FAILED"));
    }

    @ExceptionHandler(StorageException.class)
    public ResponseEntity<ApiErrorResponse> handleStorage(StorageException ex) {
        log.error("Storage error: {}", ex.getMessage(), ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.of("File operation failed", "STORAGE_ERROR"));
    }

    @ExceptionHandler(InvalidFileTypeException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidFileType(InvalidFileTypeException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiErrorResponse.of(ex.getMessage(), "INVALID_FILE_TYPE"));
    }

    @ExceptionHandler(FileTooLargeException.class)
    public ResponseEntity<ApiErrorResponse> handleFileTooLarge(FileTooLargeException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiErrorResponse.of(ex.getMessage(), "FILE_TOO_LARGE"));
    }

    @ExceptionHandler(FileDeleteException.class)
    public ResponseEntity<ApiErrorResponse> handleFileDelete(FileDeleteException ex) {
        log.error("File delete failed: {}", ex.getMessage(), ex);
        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(ApiErrorResponse.of(ex.getMessage(), "FILE_DELETE_FAILED"));
    }

    @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiErrorResponse> handleMaxUploadSizeExceeded(
            org.springframework.web.multipart.MaxUploadSizeExceededException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiErrorResponse.of("Uploaded file exceeds the maximum allowed size", "FILE_TOO_LARGE"));
    }

    // ── Spring Security exceptions ───────────────────────────────────────────
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiErrorResponse.of("Invalid email or password", "UNAUTHORIZED"));
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ApiErrorResponse> handleDisabled(DisabledException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiErrorResponse.of("Account is disabled — contact support", "ACCOUNT_DISABLED"));
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ApiErrorResponse> handleLocked(LockedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiErrorResponse.of("Account is temporarily locked", "ACCOUNT_LOCKED"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiErrorResponse.of("Insufficient permissions", "FORBIDDEN"));
    }

    // ── Fallback ─────────────────────────────────────────────────────────────
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.of("An unexpected error occurred", "INTERNAL_SERVER_ERROR"));
    }
}
