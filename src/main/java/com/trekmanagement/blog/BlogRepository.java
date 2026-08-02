package com.trekmanagement.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface BlogRepository extends JpaRepository<Blog, UUID> {

    @Query(value = "SELECT b FROM Blog b " +
            "JOIN FETCH b.author a " +
            "WHERE (:search IS NULL OR " +
            "       LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "       LOWER(b.slug) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "       LOWER(a.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "       LOWER(a.lastName) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:published IS NULL OR b.published = :published)",
            countQuery = "SELECT count(b) FROM Blog b " +
                    "JOIN b.author a " +
                    "WHERE (:search IS NULL OR " +
                    "       LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                    "       LOWER(b.slug) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                    "       LOWER(a.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                    "       LOWER(a.lastName) LIKE LOWER(CONCAT('%', :search, '%'))) " +
                    "AND (:published IS NULL OR b.published = :published)")
    Page<Blog> searchAdminBlogs(@Param("search") String search,
                                @Param("published") Boolean published,
                                Pageable pageable);

    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, UUID id);
}
