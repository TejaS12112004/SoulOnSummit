package com.trekmanagement.wishlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {
    
    List<Wishlist> findByUserIdOrderByCreatedAtDesc(UUID userId);
    
    Optional<Wishlist> findByUserIdAndTrekId(UUID userId, UUID trekId);
    
    boolean existsByUserIdAndTrekId(UUID userId, UUID trekId);
    
    void deleteByUserIdAndTrekId(UUID userId, UUID trekId);
}
