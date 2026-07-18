package com.trekmanagement.trek;

import com.trekmanagement.common.dto.PageResponse;
import com.trekmanagement.trek.dto.*;

import java.util.List;
import java.util.UUID;

public interface TrekService {

    /**
     * Get all featured treks (public view)
     */
    List<TrekSummaryResponse> getFeaturedTreks();

    // ── Admin Endpoints ───────────────────────────────────────────────────────

    TrekResponse createTrek(CreateTrekRequest request);

    TrekResponse updateTrek(UUID trekId, UpdateTrekRequest request);

    void deleteTrek(UUID trekId);

    void publishTrek(UUID trekId);

    void unpublishTrek(UUID trekId);

    void featureTrek(UUID trekId, boolean featured);

    TrekResponse getAdminTrekById(UUID trekId);

    PageResponse<TrekSummaryResponse> listTreksAdmin(TrekFilterRequest filter);

    // ── Public operations ─────────────────────────────────────────────────────

    TrekResponse getPublicTrekById(UUID trekId);

    PageResponse<TrekSummaryResponse> listPublicTreks(TrekFilterRequest filter);
}
