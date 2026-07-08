package com.trekmanagement.trek;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrekRepository extends JpaRepository<Trek, UUID>, JpaSpecificationExecutor<Trek> {

    /**
     * Public: only published + active treks visible to guests.
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

    @Modifying
    @Query("UPDATE Trek t SET t.availableSeats = t.availableSeats - :count WHERE t.id = :id AND t.availableSeats >= :count")
    int decrementAvailableSeats(@Param("id") UUID id, @Param("count") int count);

    @Modifying
    @Query("UPDATE Trek t SET t.availableSeats = t.availableSeats + :count WHERE t.id = :id")
    void incrementAvailableSeats(@Param("id") UUID id, @Param("count") int count);
}
