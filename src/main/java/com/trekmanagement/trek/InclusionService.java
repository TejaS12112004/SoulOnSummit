package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.CreateInclusionRequest;
import com.trekmanagement.trek.dto.InclusionResponse;
import com.trekmanagement.trek.dto.UpdateInclusionRequest;

import java.util.List;
import java.util.UUID;

public interface InclusionService {

    InclusionResponse createInclusion(UUID trekId, CreateInclusionRequest request);

    List<InclusionResponse> listInclusionsAdmin(UUID trekId);

    InclusionResponse updateInclusion(UUID inclusionId, UpdateInclusionRequest request);

    void deleteInclusion(UUID inclusionId);
}
