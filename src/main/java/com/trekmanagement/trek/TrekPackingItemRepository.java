package com.trekmanagement.trek;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TrekPackingItemRepository extends JpaRepository<TrekPackingItem, UUID> {

    List<TrekPackingItem> findByTrekIdOrderByDisplayOrderAsc(UUID trekId);
}
