package com.trekmanagement.trek;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.trekmanagement.admin.dto.DifficultyStatProjection;

@Repository
public interface TrekRepository extends JpaRepository<Trek, UUID>, JpaSpecificationExecutor<Trek> {

    /**
     * Public: only published + active treks visible to guests.
     * Price/date/seat filtering is handled via TrekDeparture subqueries
     * in TrekSpecification; this method is used for single-trek lookups.
     */
    Optional<Trek> findByIdAndPublishedTrueAndIsActiveTrue(UUID id);

    boolean existsByTitleIgnoreCase(String title);

    @Modifying
    @Query("UPDATE Trek t SET t.isActive = false WHERE t.id = :id")
    void softDeleteById(@Param("id") UUID id);

    @Modifying
    @Query("UPDATE Trek t SET t.published = :published WHERE t.id = :id")
    void updatePublishedStatus(@Param("id") UUID id, @Param("published") boolean published);

    @Modifying
    @Query("UPDATE Trek t SET t.featured = :featured WHERE t.id = :id")
    void updateFeaturedStatus(@Param("id") UUID id, @Param("featured") boolean featured);

    @Query("SELECT t.difficulty as difficulty, COUNT(t) as count FROM Trek t WHERE t.isActive = true GROUP BY t.difficulty")
    List<DifficultyStatProjection> getDifficultyStats();
}
