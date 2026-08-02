package com.trekmanagement.blog;

import com.trekmanagement.blog.dto.AdminBlogResponse;
import com.trekmanagement.blog.dto.BlogRequest;
import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.user.User;
import com.trekmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final BlogMapper blogMapper;

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITE_SPACE = Pattern.compile("[\\s]");

    @Override
    @Transactional(readOnly = true)
    public Page<AdminBlogResponse> searchAdminBlogs(String search, Boolean published, Pageable pageable) {
        return blogRepository.searchAdminBlogs(search, published, pageable)
                .map(blogMapper::toAdminResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminBlogResponse getAdminBlog(UUID id) {
        return blogRepository.findById(id)
                .map(blogMapper::toAdminResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
    }

    @Override
    @Transactional
    public AdminBlogResponse createBlog(BlogRequest request, UUID authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found"));

        String slug = generateSlug(request.getTitle(), request.getSlug(), null);

        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setSlug(slug);
        blog.setSummary(request.getSummary());
        blog.setBody(sanitizeHtml(request.getBody()));
        blog.setFeaturedImage(request.getFeaturedImage());
        blog.setAuthor(author);
        blog.setPublished(false);

        Blog saved = blogRepository.save(blog);
        return blogMapper.toAdminResponse(saved);
    }

    @Override
    @Transactional
    public AdminBlogResponse updateBlog(UUID id, BlogRequest request) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));

        String newSlug = generateSlug(request.getTitle(), request.getSlug(), id);
        
        // Changing a published slug is allowed but controlled by frontend warnings. Backend allows it safely.
        blog.setTitle(request.getTitle());
        blog.setSlug(newSlug);
        blog.setSummary(request.getSummary());
        blog.setBody(sanitizeHtml(request.getBody()));
        blog.setFeaturedImage(request.getFeaturedImage());

        Blog saved = blogRepository.save(blog);
        return blogMapper.toAdminResponse(saved);
    }

    @Override
    @Transactional
    public void deleteBlog(UUID id) {
        if (!blogRepository.existsById(id)) {
            throw new ResourceNotFoundException("Blog not found");
        }
        // Hard delete per schema (no deleted_at column exists in blogs table)
        blogRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void setPublishStatus(UUID id, boolean published) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));

        if (published) {
            // Cannot publish an empty body
            if (blog.getBody() == null || blog.getBody().trim().isEmpty()) {
                throw new ValidationException("Cannot publish a blog with no content");
            }
            if (blog.getPublishedAt() == null) {
                blog.setPublishedAt(Instant.now());
            }
        }

        blog.setPublished(published);
        blogRepository.save(blog);
    }

    private String sanitizeHtml(String rawHtml) {
        if (rawHtml == null) return null;
        // Allows basic text formatting, links, images, blockquotes, lists, tables.
        // Strips any script tags or dangerous event handlers like onload.
        return Jsoup.clean(rawHtml, Safelist.relaxed()
                .addAttributes("img", "class")
                .addAttributes("a", "target", "rel", "class")
                .addProtocols("a", "href", "http", "https")
                .addProtocols("img", "src", "http", "https", "data"));
    }

    private String generateSlug(String title, String requestedSlug, UUID excludeId) {
        String baseSlug;
        if (requestedSlug != null && !requestedSlug.trim().isEmpty()) {
            baseSlug = makeSlugUrlSafe(requestedSlug);
        } else {
            baseSlug = makeSlugUrlSafe(title);
        }

        if (baseSlug.isEmpty()) {
            baseSlug = "blog-post-" + UUID.randomUUID().toString().substring(0, 8);
        }

        String uniqueSlug = baseSlug;
        int counter = 1;
        while (isSlugTaken(uniqueSlug, excludeId)) {
            uniqueSlug = baseSlug + "-" + counter++;
        }

        return uniqueSlug;
    }

    private String makeSlugUrlSafe(String input) {
        String nowhitespace = WHITE_SPACE.matcher(input).replaceAll("-");
        String normalized = java.text.Normalizer.normalize(nowhitespace, java.text.Normalizer.Form.NFD);
        String slug = NON_LATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase().replaceAll("-{2,}", "-").replaceAll("^-|-$", "");
    }

    private boolean isSlugTaken(String slug, UUID excludeId) {
        if (excludeId == null) {
            return blogRepository.existsBySlug(slug);
        }
        return blogRepository.existsBySlugAndIdNot(slug, excludeId);
    }
}
