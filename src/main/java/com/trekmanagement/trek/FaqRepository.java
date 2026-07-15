package com.trekmanagement.trek;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FaqRepository extends JpaRepository<Faq, UUID> {

    /**
     * All FAQs for a given trek, ordered by displayOrder ascending.
     * Used by the admin FAQ list and the public/admin Trek Details response.
     */
    List<Faq> findByTrekIdOrderByDisplayOrderAsc(UUID trekId);
}
