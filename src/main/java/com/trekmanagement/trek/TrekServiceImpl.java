package com.trekmanagement.trek;

import com.trekmanagement.common.dto.PageResponse;
import com.trekmanagement.common.exception.ConflictException;
import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.trek.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrekServiceImpl implements TrekService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "price", "startDate", "title", "durationDays", "createdAt"
    );

    private final TrekRepository trekRepository;
    private final TrekMapper trekMapper;

    // ── Admin operations ─────────────────────────────────────────────────────

    @Override
    @Transactional
    public TrekResponse createTrek(CreateTrekRequest request) {
        validateDates(request.getStartDate().toString(), request.getEndDate().toString(),
                request.getStartDate().isBefore(request.getEndDate())
                        || request.getStartDate().isEqual(request.getEndDate()));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new ValidationException("End date must not be before start date");
        }

        if (request.getDiscountPrice() != null
                && request.getDiscountPrice().compareTo(request.getPrice()) > 0) {
            throw new ValidationException("Discount price must not exceed the full price");
        }

        Trek trek = new Trek();
        applyCreateFields(trek, request);
        trek.setAvailableSeats(request.getTotalSeats());
        trek.setPublished(false);
        trek.setFeatured(false);
        trek.setActive(true);

        Trek saved = trekRepository.save(trek);
        return trekMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public TrekResponse updateTrek(UUID trekId, UpdateTrekRequest request) {
        Trek trek = findActiveById(trekId);

        if (request.getEndDate() != null && request.getStartDate() != null
                && request.getEndDate().isBefore(request.getStartDate())) {
            throw new ValidationException("End date must not be before start date");
        }

        if (request.getEndDate() != null && request.getStartDate() == null
                && request.getEndDate().isBefore(trek.getStartDate())) {
            throw new ValidationException("End date must not be before existing start date");
        }

        if (request.getStartDate() != null && request.getEndDate() == null
                && trek.getEndDate().isBefore(request.getStartDate())) {
            throw new ValidationException("Start date must not be after existing end date");
        }

        if (request.getTotalSeats() != null) {
            int bookedSeats = trek.getTotalSeats() - trek.getAvailableSeats();
            if (request.getTotalSeats() < bookedSeats) {
                throw new ValidationException(
                        "Cannot reduce total seats below already-booked count (" + bookedSeats + ")");
            }
            int newAvailable = request.getTotalSeats() - bookedSeats;
            trek.setTotalSeats(request.getTotalSeats());
            trek.setAvailableSeats(newAvailable);
        }

        applyUpdateFields(trek, request);

        Trek saved = trekRepository.save(trek);
        return trekMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteTrek(UUID trekId) {
        if (!trekRepository.existsById(trekId)) {
            throw new ResourceNotFoundException("Trek", trekId);
        }
        trekRepository.softDeleteById(trekId);
    }

    @Override
    @Transactional
    public void publishTrek(UUID trekId) {
        Trek trek = findActiveById(trekId);
        if (trek.isPublished()) {
            throw new ConflictException("Trek is already published");
        }
        trekRepository.updatePublishedStatus(trekId, true);
    }

    @Override
    @Transactional
    public void unpublishTrek(UUID trekId) {
        Trek trek = findActiveById(trekId);
        if (!trek.isPublished()) {
            throw new ConflictException("Trek is already unpublished");
        }
        trekRepository.updatePublishedStatus(trekId, false);
    }

    @Override
    @Transactional
    public void featureTrek(UUID trekId, boolean featured) {
        findActiveById(trekId);
        trekRepository.updateFeaturedStatus(trekId, featured);
    }

    @Override
    @Transactional(readOnly = true)
    public TrekResponse getAdminTrekById(UUID trekId) {
        Trek trek = trekRepository.findById(trekId)
                .orElseThrow(() -> new ResourceNotFoundException("Trek", trekId));
        return trekMapper.toResponse(trek);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TrekSummaryResponse> listTreksAdmin(TrekFilterRequest filter) {
        Pageable pageable = buildPageable(filter);
        Specification<Trek> spec = TrekSpecification.fromFilter(filter, false);
        Page<TrekSummaryResponse> page = trekRepository.findAll(spec, pageable)
                .map(trekMapper::toSummaryResponse);
        return PageResponse.of(page);
    }

    // ── Public operations ─────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public TrekResponse getPublicTrekById(UUID trekId) {
        Trek trek = trekRepository.findByIdAndPublishedTrueAndIsActiveTrue(trekId)
                .orElseThrow(() -> new ResourceNotFoundException("Trek", trekId));
        return trekMapper.toResponse(trek);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TrekSummaryResponse> listPublicTreks(TrekFilterRequest filter) {
        Pageable pageable = buildPageable(filter);
        Specification<Trek> spec = TrekSpecification.fromFilter(filter, true);
        Page<TrekSummaryResponse> page = trekRepository.findAll(spec, pageable)
                .map(trekMapper::toSummaryResponse);
        return PageResponse.of(page);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private Trek findActiveById(UUID trekId) {
        return trekRepository.findById(trekId)
                .filter(Trek::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Trek", trekId));
    }

    private Pageable buildPageable(TrekFilterRequest filter) {
        String sortField = ALLOWED_SORT_FIELDS.contains(filter.getSortBy())
                ? filter.getSortBy()
                : "startDate";

        Sort.Direction direction = "desc".equalsIgnoreCase(filter.getSortDir())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return PageRequest.of(filter.getPage(), filter.getSize(), Sort.by(direction, sortField));
    }

    private void applyCreateFields(Trek trek, CreateTrekRequest req) {
        trek.setTitle(req.getTitle());
        trek.setSubtitle(req.getSubtitle());
        trek.setDescription(req.getDescription());
        trek.setLocation(req.getLocation());
        trek.setState(req.getState());
        trek.setCountry(StringUtils.hasText(req.getCountry()) ? req.getCountry() : "India");
        trek.setDifficulty(req.getDifficulty());
        trek.setDurationDays(req.getDurationDays());
        trek.setDistanceKm(req.getDistanceKm());
        trek.setMaxAltitude(req.getMaxAltitude());
        trek.setSummitPoint(req.getSummitPoint());
        trek.setLatitude(req.getLatitude());
        trek.setLongitude(req.getLongitude());
        trek.setPrice(req.getPrice());
        trek.setDiscountPrice(req.getDiscountPrice());
        trek.setTotalSeats(req.getTotalSeats());
        trek.setStartDate(req.getStartDate());
        trek.setEndDate(req.getEndDate());
        trek.setPickupPoint(req.getPickupPoint());
        trek.setDropPoint(req.getDropPoint());
        trek.setCoverImageUrl(req.getCoverImageUrl());
        trek.setItineraryPdfUrl(req.getItineraryPdfUrl());
        trek.setIncluded(req.getIncluded());
        trek.setExcluded(req.getExcluded());
        trek.setThingsToCarry(req.getThingsToCarry());
        trek.setCancellationPolicy(req.getCancellationPolicy());
    }

    private void applyUpdateFields(Trek trek, UpdateTrekRequest req) {
        if (StringUtils.hasText(req.getTitle()))       trek.setTitle(req.getTitle());
        if (req.getSubtitle()      != null)            trek.setSubtitle(req.getSubtitle());
        if (StringUtils.hasText(req.getDescription())) trek.setDescription(req.getDescription());
        if (StringUtils.hasText(req.getLocation()))    trek.setLocation(req.getLocation());
        if (req.getState()         != null)            trek.setState(req.getState());
        if (StringUtils.hasText(req.getCountry()))     trek.setCountry(req.getCountry());
        if (req.getDifficulty()    != null)            trek.setDifficulty(req.getDifficulty());
        if (req.getDurationDays()  != null)            trek.setDurationDays(req.getDurationDays());
        if (req.getDistanceKm()    != null)            trek.setDistanceKm(req.getDistanceKm());
        if (req.getMaxAltitude()   != null)            trek.setMaxAltitude(req.getMaxAltitude());
        if (req.getSummitPoint()   != null)            trek.setSummitPoint(req.getSummitPoint());
        if (req.getLatitude()      != null)            trek.setLatitude(req.getLatitude());
        if (req.getLongitude()     != null)            trek.setLongitude(req.getLongitude());
        if (req.getPrice()         != null)            trek.setPrice(req.getPrice());
        if (req.getDiscountPrice() != null)            trek.setDiscountPrice(req.getDiscountPrice());
        if (req.getStartDate()     != null)            trek.setStartDate(req.getStartDate());
        if (req.getEndDate()       != null)            trek.setEndDate(req.getEndDate());
        if (req.getPickupPoint()   != null)            trek.setPickupPoint(req.getPickupPoint());
        if (req.getDropPoint()     != null)            trek.setDropPoint(req.getDropPoint());
        if (req.getCoverImageUrl() != null)            trek.setCoverImageUrl(req.getCoverImageUrl());
        if (req.getItineraryPdfUrl() != null)          trek.setItineraryPdfUrl(req.getItineraryPdfUrl());
        if (req.getIncluded()      != null)            trek.setIncluded(req.getIncluded());
        if (req.getExcluded()      != null)            trek.setExcluded(req.getExcluded());
        if (req.getThingsToCarry() != null)            trek.setThingsToCarry(req.getThingsToCarry());
        if (req.getCancellationPolicy() != null)       trek.setCancellationPolicy(req.getCancellationPolicy());
    }

    private void validateDates(String startLabel, String endLabel, boolean valid) {
        // overload kept for potential future named-param use; real check inline in createTrek
    }
}
