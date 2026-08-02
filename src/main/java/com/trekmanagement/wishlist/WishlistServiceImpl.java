package com.trekmanagement.wishlist;

import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.security.UserPrincipal;
import com.trekmanagement.trek.Trek;
import com.trekmanagement.trek.TrekRepository;
import com.trekmanagement.trek.dto.TrekSummaryResponse;
import com.trekmanagement.trek.TrekMapper;
import com.trekmanagement.user.User;
import com.trekmanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final TrekRepository trekRepository;
    private final TrekMapper trekMapper;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal) {
            UUID userId = ((UserPrincipal) principal).getId();
            return userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        }
        throw new IllegalStateException("User not authenticated");
    }

    @Override
    @Transactional
    public void addToWishlist(UUID trekId) {
        User user = getCurrentUser();
        
        if (wishlistRepository.existsByUserIdAndTrekId(user.getId(), trekId)) {
            return; // Already in wishlist
        }
        
        Trek trek = trekRepository.findById(trekId)
                .orElseThrow(() -> new ResourceNotFoundException("Trek not found"));
                
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setTrek(trek);
        
        wishlistRepository.save(wishlist);
    }

    @Override
    @Transactional
    public void removeFromWishlist(UUID trekId) {
        User user = getCurrentUser();
        wishlistRepository.deleteByUserIdAndTrekId(user.getId(), trekId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrekSummaryResponse> getMyWishlist() {
        User user = getCurrentUser();
        List<Wishlist> wishlists = wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        
        return wishlists.stream()
                .map(Wishlist::getTrek)
                .map(trekMapper::toSummaryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UUID> getWishlistTrekIds() {
        User user = getCurrentUser();
        List<Wishlist> wishlists = wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        
        return wishlists.stream()
                .map(w -> w.getTrek().getId())
                .collect(Collectors.toList());
    }
}
