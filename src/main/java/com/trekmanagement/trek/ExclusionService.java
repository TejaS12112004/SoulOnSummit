package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.CreateExclusionRequest;
import com.trekmanagement.trek.dto.ExclusionResponse;
import com.trekmanagement.trek.dto.UpdateExclusionRequest;

import java.util.List;
import java.util.UUID;

public interface ExclusionService {

    ExclusionResponse createExclusion(UUID trekId, CreateExclusionRequest request);

    List<ExclusionResponse> listExclusionsAdmin(UUID trekId);

    ExclusionResponse updateExclusion(UUID exclusionId, UpdateExclusionRequest request);

    void deleteExclusion(UUID exclusionId);
}
