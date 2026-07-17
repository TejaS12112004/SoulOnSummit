package com.trekmanagement.trek;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TrekItineraryDayRepository extends JpaRepository<TrekItineraryDay, UUID> {

    /**
     * All itinerary days for a given trek, ordered by displayOrder ascending.
     * Used by the admin itinerary list and the public/admin Trek Details response.
     */
    List<TrekItineraryDay> findByTrekIdOrderByDisplayOrderAsc(UUID trekId);
}
