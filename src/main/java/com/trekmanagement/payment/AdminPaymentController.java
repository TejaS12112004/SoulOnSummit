package com.trekmanagement.payment;

import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.common.dto.PageResponse;
import com.trekmanagement.payment.dto.AdminPaymentResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/payments")
@RequiredArgsConstructor
@Tag(name = "Admin Payments", description = "Admin payment management")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @Operation(summary = "List all payments (Admin) with filtering and pagination")
    public ResponseEntity<ApiResponse<PageResponse<AdminPaymentResponse>>> listPaymentsAdmin(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        // Whitelist allowed sort fields
        String actualSortBy = switch (sortBy) {
            case "amount", "status", "paymentMethod" -> sortBy;
            default -> "createdAt";
        };

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), actualSortBy));
        Page<AdminPaymentResponse> result = paymentService.searchAdminPayments(search, pageable);

        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(result)));
    }

    @PostMapping("/{id}/mark-paid")
    @Operation(summary = "Manually mark a payment as SUCCESS")
    public ResponseEntity<ApiResponse<Void>> markPaymentAsPaid(@PathVariable UUID id) {
        paymentService.markAsPaid(id);
        return ResponseEntity.ok(ApiResponse.success("Payment marked as paid successfully"));
    }

    @PostMapping("/{id}/refund")
    @Operation(summary = "Refund a successful payment")
    public ResponseEntity<ApiResponse<Void>> refundPayment(@PathVariable UUID id) {
        paymentService.refundPayment(id);
        return ResponseEntity.ok(ApiResponse.success("Payment refunded successfully"));
    }
}
