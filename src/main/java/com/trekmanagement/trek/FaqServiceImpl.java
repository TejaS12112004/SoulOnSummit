package com.trekmanagement.trek;

import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.trek.dto.CreateFaqRequest;
import com.trekmanagement.trek.dto.FaqResponse;
import com.trekmanagement.trek.dto.UpdateFaqRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FaqServiceImpl implements FaqService {

    private final FaqRepository faqRepository;
    private final TrekRepository trekRepository;
    private final FaqMapper faqMapper;

    // ── Admin operations ──────────────────────────────────────────────────────

    @Override
    @Transactional
    public FaqResponse createFaq(UUID trekId, CreateFaqRequest request) {
        Trek trek = findTrek(trekId);

        Faq faq = new Faq();
        faq.setTrek(trek);
        faq.setQuestion(request.getQuestion());
        faq.setAnswer(request.getAnswer());
        faq.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);

        Faq saved = faqRepository.save(faq);
        return faqMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FaqResponse> listFaqsAdmin(UUID trekId) {
        assertTrekExists(trekId);
        List<Faq> faqs = faqRepository.findByTrekIdOrderByDisplayOrderAsc(trekId);
        return faqMapper.toResponseList(faqs);
    }

    @Override
    @Transactional
    public FaqResponse updateFaq(UUID faqId, UpdateFaqRequest request) {
        Faq faq = findFaq(faqId);

        if (StringUtils.hasText(request.getQuestion())) {
            faq.setQuestion(request.getQuestion());
        }
        if (StringUtils.hasText(request.getAnswer())) {
            faq.setAnswer(request.getAnswer());
        }
        if (request.getDisplayOrder() != null) {
            faq.setDisplayOrder(request.getDisplayOrder());
        }

        Faq saved = faqRepository.save(faq);
        return faqMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteFaq(UUID faqId) {
        Faq faq = findFaq(faqId);
        faqRepository.delete(faq);
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

    private Faq findFaq(UUID faqId) {
        return faqRepository.findById(faqId)
                .orElseThrow(() -> new ResourceNotFoundException("Faq", faqId));
    }
}
