package com.trekmanagement.wishlist;

import com.trekmanagement.trek.dto.TrekSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<TrekSummaryResponse>> getMyWishlist() {
        return ResponseEntity.ok(wishlistService.getMyWishlist());
    }

    @GetMapping("/ids")
    public ResponseEntity<List<UUID>> getWishlistTrekIds() {
        return ResponseEntity.ok(wishlistService.getWishlistTrekIds());
    }

    @PostMapping("/{trekId}")
    public ResponseEntity<Void> addToWishlist(@PathVariable UUID trekId) {
        wishlistService.addToWishlist(trekId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{trekId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable UUID trekId) {
        wishlistService.removeFromWishlist(trekId);
        return ResponseEntity.ok().build();
    }
}
