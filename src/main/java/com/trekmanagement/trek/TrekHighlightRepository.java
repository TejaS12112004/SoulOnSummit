package com.trekmanagement.trek;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TrekHighlightRepository extends JpaRepository<TrekHighlight, UUID> {

    /**
     * All highlights for a given trek, ordered by displayOrder ascending.
     * Used by the admin highlight list and the public/admin Trek Details response.
     */
    List<TrekHighlight> findByTrekIdOrderByDisplayOrderAsc(UUID trekId);
}
