package com.trekmanagement.trek;

import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.trek.dto.CreateHighlightRequest;
import com.trekmanagement.trek.dto.HighlightResponse;
import com.trekmanagement.trek.dto.UpdateHighlightRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HighlightServiceImpl implements HighlightService {

    private final TrekHighlightRepository highlightRepository;
    private final TrekRepository trekRepository;
    private final HighlightMapper highlightMapper;

    // ── Admin operations ──────────────────────────────────────────────────────

    @Override
    @Transactional
    public HighlightResponse createHighlight(UUID trekId, CreateHighlightRequest request) {
        Trek trek = findTrek(trekId);

        TrekHighlight highlight = new TrekHighlight();
        highlight.setTrek(trek);
        highlight.setTitle(request.getTitle().trim());
        highlight.setDescription(request.getDescription());
        highlight.setIconName(request.getIconName() != null ? request.getIconName().trim() : null);
        highlight.setDisplayOrder(request.getDisplayOrder());

        return highlightMapper.toResponse(highlightRepository.save(highlight));
    }

    @Override
    @Transactional(readOnly = true)
    public List<HighlightResponse> listHighlightsAdmin(UUID trekId) {
        assertTrekExists(trekId);
        return highlightMapper.toResponseList(
                highlightRepository.findByTrekIdOrderByDisplayOrderAsc(trekId));
    }

    @Override
    @Transactional
    public HighlightResponse updateHighlight(UUID highlightId, UpdateHighlightRequest request) {
        TrekHighlight highlight = findHighlight(highlightId);

        if (request.getTitle() != null) {
            if (!StringUtils.hasText(request.getTitle())) {
                throw new ValidationException("Title cannot be blank");
            }
            highlight.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null)  highlight.setDescription(request.getDescription());
        if (request.getIconName()    != null)  highlight.setIconName(request.getIconName().trim());
        if (request.getDisplayOrder() != null) highlight.setDisplayOrder(request.getDisplayOrder());

        // highlight is a managed entity — Hibernate flushes changes on transaction commit.
        // No explicit save() needed.
        return highlightMapper.toResponse(highlight);
    }

    @Override
    @Transactional
    public void deleteHighlight(UUID highlightId) {
        TrekHighlight highlight = findHighlight(highlightId);
        highlightRepository.delete(highlight);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private Trek findTrek(UUID trekId) {
        return trekRepository.findById(trekId)
                .orElseThrow(() -> new ResourceNotFoundException("Trek", trekId));
    }

    private void assertTrekExists(UUID trekId) {
        if (!trekRepository.existsById(trekId)) {
            throw new ResourceNotFoundException("Trek", trekId);
        }
    }

    private TrekHighlight findHighlight(UUID highlightId) {
        return highlightRepository.findById(highlightId)
                .orElseThrow(() -> new ResourceNotFoundException("Highlight", highlightId));
    }
}
