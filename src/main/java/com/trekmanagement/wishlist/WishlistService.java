package com.trekmanagement.wishlist;

import com.trekmanagement.trek.dto.TrekSummaryResponse;
import java.util.List;
import java.util.UUID;

public interface WishlistService {
    void addToWishlist(UUID trekId);
    void removeFromWishlist(UUID trekId);
    List<TrekSummaryResponse> getMyWishlist();
    List<UUID> getWishlistTrekIds();
}
