package com.trekmanagement.trek;

import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.trek.dto.CreateInclusionRequest;
import com.trekmanagement.trek.dto.InclusionResponse;
import com.trekmanagement.trek.dto.UpdateInclusionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InclusionServiceImpl implements InclusionService {

    private final TrekInclusionRepository inclusionRepository;
    private final TrekRepository trekRepository;
    private final InclusionMapper inclusionMapper;

    @Override
    @Transactional
    public InclusionResponse createInclusion(UUID trekId, CreateInclusionRequest request) {
        Trek trek = findTrek(trekId);

        TrekInclusion inclusion = new TrekInclusion();
        inclusion.setTrek(trek);
        inclusion.setTitle(request.getTitle().trim());
        inclusion.setDescription(request.getDescription());
        inclusion.setDisplayOrder(request.getDisplayOrder());

        return inclusionMapper.toResponse(inclusionRepository.save(inclusion));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InclusionResponse> listInclusionsAdmin(UUID trekId) {
        assertTrekExists(trekId);
        return inclusionMapper.toResponseList(
                inclusionRepository.findByTrekIdOrderByDisplayOrderAsc(trekId));
    }

    @Override
    @Transactional
    public InclusionResponse updateInclusion(UUID inclusionId, UpdateInclusionRequest request) {
        TrekInclusion inclusion = findInclusion(inclusionId);

        if (request.getTitle() != null) {
            if (!StringUtils.hasText(request.getTitle())) {
                throw new ValidationException("Title cannot be blank");
            }
            inclusion.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) inclusion.setDescription(request.getDescription());
        if (request.getDisplayOrder() != null) inclusion.setDisplayOrder(request.getDisplayOrder());

        return inclusionMapper.toResponse(inclusion);
    }

    @Override
    @Transactional
    public void deleteInclusion(UUID inclusionId) {
        inclusionRepository.delete(findInclusion(inclusionId));
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

    private TrekInclusion findInclusion(UUID inclusionId) {
        return inclusionRepository.findById(inclusionId)
                .orElseThrow(() -> new ResourceNotFoundException("Inclusion", inclusionId));
    }
}
