package com.trekmanagement.user;

import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.common.dto.PageResponse;
import com.trekmanagement.user.dto.AdminUserResponse;
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

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin Users", description = "Admin user management")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "List all users (Admin) with filtering and pagination")
    public ResponseEntity<ApiResponse<PageResponse<AdminUserResponse>>> listUsersAdmin(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        // Whitelist allowed sort fields
        String actualSortBy = switch (sortBy) {
            case "firstName", "lastName", "email" -> sortBy;
            default -> "createdAt";
        };

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), actualSortBy));
        Page<AdminUserResponse> result = userService.searchAdminUsers(search, pageable);

        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(result)));
    }
}
