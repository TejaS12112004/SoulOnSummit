package com.trekmanagement.trek;

import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.trek.dto.CreatePackingItemRequest;
import com.trekmanagement.trek.dto.PackingItemResponse;
import com.trekmanagement.trek.dto.UpdatePackingItemRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PackingItemServiceImpl implements PackingItemService {

    private final TrekPackingItemRepository packingItemRepository;
    private final TrekRepository trekRepository;
    private final PackingItemMapper packingItemMapper;

    @Override
    @Transactional
    public PackingItemResponse createPackingItem(UUID trekId, CreatePackingItemRequest request) {
        Trek trek = findTrek(trekId);

        TrekPackingItem item = new TrekPackingItem();
        item.setTrek(trek);
        item.setTitle(request.getTitle().trim());
        item.setDescription(request.getDescription());
        item.setDisplayOrder(request.getDisplayOrder());

        return packingItemMapper.toResponse(packingItemRepository.save(item));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PackingItemResponse> listPackingItemsAdmin(UUID trekId) {
        assertTrekExists(trekId);
        return packingItemMapper.toResponseList(
                packingItemRepository.findByTrekIdOrderByDisplayOrderAsc(trekId));
    }

    @Override
    @Transactional
    public PackingItemResponse updatePackingItem(UUID itemId, UpdatePackingItemRequest request) {
        TrekPackingItem item = findPackingItem(itemId);

        if (request.getTitle() != null) {
            if (!StringUtils.hasText(request.getTitle())) {
                throw new ValidationException("Title cannot be blank");
            }
            item.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) item.setDescription(request.getDescription());
        if (request.getDisplayOrder() != null) item.setDisplayOrder(request.getDisplayOrder());

        return packingItemMapper.toResponse(item);
    }

    @Override
    @Transactional
    public void deletePackingItem(UUID itemId) {
        packingItemRepository.delete(findPackingItem(itemId));
    }

    private Trek findTrek(UUID trekId) {
        return trekRepository.findById(trekId)
                .orElseThrow(() -> new ResourceNotFoundException("Trek", trekId));
    }

    private void assertTrekExists(UUID trekId) {
        if (!trekRepository.existsById(trekId)) {
            throw new ResourceNotFoundException("Trek", trekId);
        }
    }

    private TrekPackingItem findPackingItem(UUID itemId) {
        return packingItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("PackingItem", itemId));
    }
}
