package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.CreateHighlightRequest;
import com.trekmanagement.trek.dto.HighlightResponse;
import com.trekmanagement.trek.dto.UpdateHighlightRequest;

import java.util.List;
import java.util.UUID;

public interface HighlightService {

    // ── Admin operations ──────────────────────────────────────────────────────

    HighlightResponse createHighlight(UUID trekId, CreateHighlightRequest request);

    /** Returns all highlights for a trek, ordered displayOrder ASC. */
    List<HighlightResponse> listHighlightsAdmin(UUID trekId);

    HighlightResponse updateHighlight(UUID highlightId, UpdateHighlightRequest request);

    void deleteHighlight(UUID highlightId);
}
