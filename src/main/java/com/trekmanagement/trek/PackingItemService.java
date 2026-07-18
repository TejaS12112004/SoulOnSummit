package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.CreatePackingItemRequest;
import com.trekmanagement.trek.dto.PackingItemResponse;
import com.trekmanagement.trek.dto.UpdatePackingItemRequest;

import java.util.List;
import java.util.UUID;

public interface PackingItemService {

    PackingItemResponse createPackingItem(UUID trekId, CreatePackingItemRequest request);

    List<PackingItemResponse> listPackingItemsAdmin(UUID trekId);

    PackingItemResponse updatePackingItem(UUID itemId, UpdatePackingItemRequest request);

    void deletePackingItem(UUID itemId);
}
