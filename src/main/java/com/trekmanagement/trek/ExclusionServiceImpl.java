package com.trekmanagement.trek;

import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.trek.dto.CreateExclusionRequest;
import com.trekmanagement.trek.dto.ExclusionResponse;
import com.trekmanagement.trek.dto.UpdateExclusionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExclusionServiceImpl implements ExclusionService {

    private final TrekExclusionRepository exclusionRepository;
    private final TrekRepository trekRepository;
    private final ExclusionMapper exclusionMapper;

    @Override
    @Transactional
    public ExclusionResponse createExclusion(UUID trekId, CreateExclusionRequest request) {
        Trek trek = findTrek(trekId);

        TrekExclusion exclusion = new TrekExclusion();
        exclusion.setTrek(trek);
        exclusion.setTitle(request.getTitle().trim());
        exclusion.setDescription(request.getDescription());
        exclusion.setDisplayOrder(request.getDisplayOrder());

        return exclusionMapper.toResponse(exclusionRepository.save(exclusion));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExclusionResponse> listExclusionsAdmin(UUID trekId) {
        assertTrekExists(trekId);
        return exclusionMapper.toResponseList(
                exclusionRepository.findByTrekIdOrderByDisplayOrderAsc(trekId));
    }

    @Override
    @Transactional
    public ExclusionResponse updateExclusion(UUID exclusionId, UpdateExclusionRequest request) {
        TrekExclusion exclusion = findExclusion(exclusionId);

        if (request.getTitle() != null) {
            if (!StringUtils.hasText(request.getTitle())) {
                throw new ValidationException("Title cannot be blank");
            }
            exclusion.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) exclusion.setDescription(request.getDescription());
        if (request.getDisplayOrder() != null) exclusion.setDisplayOrder(request.getDisplayOrder());

        return exclusionMapper.toResponse(exclusion);
    }

    @Override
    @Transactional
    public void deleteExclusion(UUID exclusionId) {
        exclusionRepository.delete(findExclusion(exclusionId));
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

    private TrekExclusion findExclusion(UUID exclusionId) {
        return exclusionRepository.findById(exclusionId)
                .orElseThrow(() -> new ResourceNotFoundException("Exclusion", exclusionId));
    }
}
