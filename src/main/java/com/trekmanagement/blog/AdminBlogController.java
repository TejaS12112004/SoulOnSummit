package com.trekmanagement.blog;

import com.trekmanagement.blog.dto.AdminBlogResponse;
import com.trekmanagement.blog.dto.BlogRequest;
import com.trekmanagement.blog.dto.PublishStatusRequest;
import com.trekmanagement.common.dto.ApiResponse;
import com.trekmanagement.common.dto.PageResponse;
import com.trekmanagement.user.User;
import com.trekmanagement.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/blogs")
@RequiredArgsConstructor
@Tag(name = "Admin Blogs", description = "Admin blog content management")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBlogController {

    private final BlogService blogService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "List all blogs (Admin) with filtering and pagination")
    public ResponseEntity<ApiResponse<PageResponse<AdminBlogResponse>>> listAdminBlogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean published,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        String actualSortBy = switch (sortBy) {
            case "title", "published", "createdAt", "updatedAt" -> sortBy;
            default -> "createdAt";
        };

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), actualSortBy));
        Page<AdminBlogResponse> result = blogService.searchAdminBlogs(search, published, pageable);

        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(result)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a specific blog for editing")
    public ResponseEntity<ApiResponse<AdminBlogResponse>> getAdminBlog(@PathVariable UUID id) {
        AdminBlogResponse response = blogService.getAdminBlog(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @Operation(summary = "Create a new blog")
    public ResponseEntity<ApiResponse<AdminBlogResponse>> createBlog(@Valid @RequestBody BlogRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User author = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));

        AdminBlogResponse response = blogService.createBlog(request, author.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Blog created successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing blog")
    public ResponseEntity<ApiResponse<AdminBlogResponse>> updateBlog(
            @PathVariable UUID id,
            @Valid @RequestBody BlogRequest request) {
        AdminBlogResponse response = blogService.updateBlog(id, request);
        return ResponseEntity.ok(ApiResponse.success("Blog updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a blog")
    public ResponseEntity<ApiResponse<Void>> deleteBlog(@PathVariable UUID id) {
        blogService.deleteBlog(id);
        return ResponseEntity.ok(ApiResponse.success("Blog deleted successfully"));
    }

    @PatchMapping("/{id}/publication")
    @Operation(summary = "Set publication status of a blog")
    public ResponseEntity<ApiResponse<Void>> setPublicationStatus(
            @PathVariable UUID id,
            @Valid @RequestBody PublishStatusRequest request) {
        blogService.setPublishStatus(id, request.getPublished());
        return ResponseEntity.ok(ApiResponse.success("Blog publication status updated successfully"));
    }
}
