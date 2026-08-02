package com.trekmanagement.review;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    @Query(value = "SELECT r FROM Review r " +
            "JOIN FETCH r.user u " +
            "JOIN FETCH r.trek t " +
            "WHERE (:search IS NULL OR " +
            "       LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "       LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "       LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "       LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:status IS NULL OR " +
            "     (:status = 'PENDING' AND r.approved = false) OR " +
            "     (:status = 'APPROVED' AND r.approved = true)) " +
            "AND (:featured IS NULL OR r.featured = :featured)",
            countQuery = "SELECT count(r) FROM Review r " +
                    "JOIN r.user u " +
                    "JOIN r.trek t " +
                    "WHERE (:search IS NULL OR " +
                    "       LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                    "       LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                    "       LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                    "       LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%'))) " +
                    "AND (:status IS NULL OR " +
                    "     (:status = 'PENDING' AND r.approved = false) OR " +
                    "     (:status = 'APPROVED' AND r.approved = true)) " +
                    "AND (:featured IS NULL OR r.featured = :featured)")
    Page<Review> searchReviews(@Param("search") String search,
                               @Param("status") String status,
                               @Param("featured") Boolean featured,
                               Pageable pageable);
}
