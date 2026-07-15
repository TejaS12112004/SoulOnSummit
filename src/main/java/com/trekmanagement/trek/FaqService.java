package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.CreateFaqRequest;
import com.trekmanagement.trek.dto.FaqResponse;
import com.trekmanagement.trek.dto.UpdateFaqRequest;

import java.util.List;
import java.util.UUID;

public interface FaqService {

    // ── Admin operations ──────────────────────────────────────────────────────

    FaqResponse createFaq(UUID trekId, CreateFaqRequest request);

    /** Returns all FAQs for a trek, ordered displayOrder ASC. Admin use. */
    List<FaqResponse> listFaqsAdmin(UUID trekId);

    FaqResponse updateFaq(UUID faqId, UpdateFaqRequest request);

    void deleteFaq(UUID faqId);
}
