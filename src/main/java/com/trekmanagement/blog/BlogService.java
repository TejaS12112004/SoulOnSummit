package com.trekmanagement.blog;

import com.trekmanagement.blog.dto.AdminBlogResponse;
import com.trekmanagement.blog.dto.BlogRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface BlogService {
    Page<AdminBlogResponse> searchAdminBlogs(String search, Boolean published, Pageable pageable);
    AdminBlogResponse getAdminBlog(UUID id);
    AdminBlogResponse createBlog(BlogRequest request, UUID authorId);
    AdminBlogResponse updateBlog(UUID id, BlogRequest request);
    void deleteBlog(UUID id);
    void setPublishStatus(UUID id, boolean published);
}
