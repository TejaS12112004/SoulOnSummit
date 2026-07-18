package com.trekmanagement.trek;

import com.trekmanagement.common.dto.PageResponse;
import com.trekmanagement.common.exception.ConflictException;
import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.trek.dto.*;
import com.trekmanagement.trek.HighlightMapper;
import com.trekmanagement.trek.ItineraryDayMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrekServiceImpl implements TrekService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "title", "durationDays", "createdAt"
    );

    private final TrekRepository trekRepository;
    private final TrekDepartureRepository departureRepository;
    private final TrekMapper trekMapper;
    private final TrekDepartureMapper departureMapper;
    private final FaqMapper faqMapper;
    private final ItineraryDayMapper itineraryDayMapper;
    private final HighlightMapper highlightMapper;

    // ── Admin operations ─────────────────────────────────────────────────────

    @Override
    @Transactional
    public TrekResponse createTrek(CreateTrekRequest request) {
        Trek trek = new Trek();
        applyCreateFields(trek, request);
        trek.setPublished(false);
        trek.setFeatured(false);
        trek.setActive(true);

        Trek saved = trekRepository.save(trek);
        // Newly created trek has no departures — return response with empty lists
        return buildTrekResponse(saved, List.of());
    }

    @Override
    @Transactional
    public TrekResponse updateTrek(UUID trekId, UpdateTrekRequest request) {
        Trek trek = findActiveById(trekId);
        applyUpdateFields(trek, request);
        Trek saved = trekRepository.save(trek);
        // Load current departures for the response
        List<TrekDeparture> departures =
                departureRepository.findByTrekIdOrderByStartDateAsc(trekId);
        return buildTrekResponse(saved, departures);
    }

    @Override
    @Transactional
    public void deleteTrek(UUID trekId) {
        if (!trekRepository.existsById(trekId)) {
            throw new ResourceNotFoundException("Trek", trekId);
        }
        trekRepository.softDeleteById(trekId);
        // Cascade-deactivate all departures for this trek
        departureRepository.deactivateAllByTrekId(trekId);
    }

    @Override
    @Transactional
    public void publishTrek(UUID trekId) {
        Trek trek = findActiveById(trekId);

        if (trek.isPublished()) {
            throw new ConflictException("Trek is already published");
        }

        // Guard 1: cover image must exist
        if (!StringUtils.hasText(trek.getCoverImageUrl())) {
            throw new ValidationException(
                    "Trek cannot be published without a cover image");
        }

        // Guard 2: at least one active OPEN future departure must exist
        boolean hasOpenDeparture =
                departureRepository.existsByTrekIdAndStatusAndIsActiveTrueAndStartDateAfter(
                        trekId, DepartureStatus.OPEN, LocalDate.now());

        if (!hasOpenDeparture) {
            throw new ValidationException(
                    "Trek cannot be published without at least one active upcoming departure. " +
                    "Add a departure with status OPEN and a future start date first.");
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
        List<TrekDeparture> departures =
                departureRepository.findByTrekIdOrderByStartDateAsc(trekId);
        return buildTrekResponse(trek, departures);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TrekSummaryResponse> listTreksAdmin(TrekFilterRequest filter) {
        Pageable pageable = buildPageable(filter);
        Specification<Trek> spec = TrekSpecification.fromFilter(filter, false);
        Page<TrekSummaryResponse> page = trekRepository.findAll(spec, pageable)
                .map(trek -> buildSummaryResponse(trek, false));
        return PageResponse.of(page);
    }

    // ── Public operations ─────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public TrekResponse getPublicTrekById(UUID trekId) {
        Trek trek = trekRepository.findByIdAndPublishedTrueAndIsActiveTrue(trekId)
                .orElseThrow(() -> new ResourceNotFoundException("Trek", trekId));
        // Public: only OPEN future departures
        List<TrekDeparture> departures =
                departureRepository
                        .findByTrekIdAndStatusAndIsActiveTrueAndStartDateAfterOrderByStartDateAsc(
                                trekId, DepartureStatus.OPEN, LocalDate.now());
        return buildTrekResponse(trek, departures);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TrekSummaryResponse> listPublicTreks(TrekFilterRequest filter) {
        Pageable pageable = buildPageable(filter);
        Specification<Trek> spec = TrekSpecification.fromFilter(filter, true);
        Page<TrekSummaryResponse> page = trekRepository.findAll(spec, pageable)
                .map(trek -> buildSummaryResponse(trek, true));
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
                : "createdAt";

        Sort.Direction direction = "desc".equalsIgnoreCase(filter.getSortDir())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return PageRequest.of(filter.getPage(), filter.getSize(),
                Sort.by(direction, sortField));
    }

    /**
     * Builds a full TrekResponse including the embedded departures list
     * and derived fields (lowestPrice, nextDepartureDate).
     * Callers are responsible for pre-filtering the departures list
     * (e.g. public endpoints pass only OPEN future departures).
     */
    private TrekResponse buildTrekResponse(Trek trek, List<TrekDeparture> departures) {
        List<DepartureResponse> departureResponses =
                departureMapper.toResponseList(departures);

        BigDecimal lowestPrice    = computeLowestPrice(departures);
        LocalDate  nextDepartDate = computeNextDepartureDate(departures);

        return TrekResponse.builder()
                .id(trek.getId())
                .title(trek.getTitle())
                .subtitle(trek.getSubtitle())
                .description(trek.getDescription())
                .location(trek.getLocation())
                .state(trek.getState())
                .country(trek.getCountry())
                .difficulty(trek.getDifficulty())
                .durationDays(trek.getDurationDays())
                .distanceKm(trek.getDistanceKm())
                .maxAltitude(trek.getMaxAltitude())
                .summitPoint(trek.getSummitPoint())
                .latitude(trek.getLatitude())
                .longitude(trek.getLongitude())
                .pickupPoint(trek.getPickupPoint())
                .dropPoint(trek.getDropPoint())
                .coverImageUrl(trek.getCoverImageUrl())
                .itineraryPdfUrl(trek.getItineraryPdfUrl())
                .included(trek.getIncluded())
                .excluded(trek.getExcluded())
                .thingsToCarry(trek.getThingsToCarry())
                .cancellationPolicy(trek.getCancellationPolicy())
                .featured(trek.isFeatured())
                .published(trek.isPublished())
                .active(trek.isActive())
                .images(trekMapper.toImageResponseList(trek.getImages()))
                .faqs(faqMapper.toResponseList(trek.getFaqs()))
                .itineraryDays(itineraryDayMapper.toResponseList(trek.getItineraryDays()))
                .highlights(highlightMapper.toResponseList(trek.getHighlights()))
                .departures(departureResponses)
                .lowestPrice(lowestPrice)
                .nextDepartureDate(nextDepartDate)
                .createdAt(trek.getCreatedAt())
                .updatedAt(trek.getUpdatedAt())
                .build();
    }

    /**
     * Builds a TrekSummaryResponse for listing pages.
     * Loads the next upcoming OPEN departure for the derived fields.
     */
    private TrekSummaryResponse buildSummaryResponse(Trek trek, boolean publicView) {
        List<TrekDeparture> openFutureDepartures =
                departureRepository
                        .findByTrekIdAndStatusAndIsActiveTrueAndStartDateAfterOrderByStartDateAsc(
                                trek.getId(), DepartureStatus.OPEN, LocalDate.now());

        BigDecimal lowestPrice             = computeLowestPrice(openFutureDepartures);
        LocalDate  nextDepartureDate       = computeNextDepartureDate(openFutureDepartures);
        Integer    nextAvailableSeats      = openFutureDepartures.isEmpty()
                ? null
                : openFutureDepartures.get(0).getAvailableSeats();

        return TrekSummaryResponse.builder()
                .id(trek.getId())
                .title(trek.getTitle())
                .subtitle(trek.getSubtitle())
                .location(trek.getLocation())
                .state(trek.getState())
                .difficulty(trek.getDifficulty())
                .durationDays(trek.getDurationDays())
                .coverImageUrl(trek.getCoverImageUrl())
                .featured(trek.isFeatured())
                .published(trek.isPublished())
                .lowestPrice(lowestPrice)
                .nextDepartureDate(nextDepartureDate)
                .nextDepartureAvailableSeats(nextAvailableSeats)
                .build();
    }

    /**
     * Returns the lowest effective price across the given departures.
     * Effective price = discountPrice if present, else price.
     */
    private BigDecimal computeLowestPrice(List<TrekDeparture> departures) {
        return departures.stream()
                .map(d -> d.getDiscountPrice() != null ? d.getDiscountPrice() : d.getPrice())
                .min(Comparator.naturalOrder())
                .orElse(null);
    }

    /**
     * Returns the startDate of the earliest departure in the list.
     * List is already ordered startDate ASC from the repository query.
     */
    private LocalDate computeNextDepartureDate(List<TrekDeparture> departures) {
        return departures.isEmpty() ? null : departures.get(0).getStartDate();
    }

    private void applyCreateFields(Trek trek, CreateTrekRequest req) {
        trek.setTitle(req.getTitle().trim());
        trek.setSubtitle(req.getSubtitle() != null ? req.getSubtitle().trim() : null);
        trek.setDescription(req.getDescription().trim());
        trek.setLocation(req.getLocation().trim());
        trek.setState(req.getState() != null ? req.getState().trim() : null);
        trek.setCountry(StringUtils.hasText(req.getCountry()) ? req.getCountry().trim() : "India");
        trek.setDifficulty(req.getDifficulty());
        trek.setDurationDays(req.getDurationDays());
        trek.setDistanceKm(req.getDistanceKm());
        trek.setMaxAltitude(req.getMaxAltitude());
        trek.setSummitPoint(req.getSummitPoint() != null ? req.getSummitPoint().trim() : null);
        trek.setLatitude(req.getLatitude());
        trek.setLongitude(req.getLongitude());
        trek.setPickupPoint(req.getPickupPoint() != null ? req.getPickupPoint().trim() : null);
        trek.setDropPoint(req.getDropPoint() != null ? req.getDropPoint().trim() : null);
        trek.setCoverImageUrl(req.getCoverImageUrl() != null ? req.getCoverImageUrl().trim() : null);
        trek.setItineraryPdfUrl(req.getItineraryPdfUrl() != null ? req.getItineraryPdfUrl().trim() : null);
        trek.setIncluded(req.getIncluded());
        trek.setExcluded(req.getExcluded());
        trek.setThingsToCarry(req.getThingsToCarry());
        trek.setCancellationPolicy(req.getCancellationPolicy());
    }

    private void applyUpdateFields(Trek trek, UpdateTrekRequest req) {
        if (StringUtils.hasText(req.getTitle()))        trek.setTitle(req.getTitle().trim());
        if (req.getSubtitle()       != null)            trek.setSubtitle(req.getSubtitle().trim());
        if (StringUtils.hasText(req.getDescription()))  trek.setDescription(req.getDescription().trim());
        if (StringUtils.hasText(req.getLocation()))     trek.setLocation(req.getLocation().trim());
        if (req.getState()          != null)            trek.setState(req.getState().trim());
        if (StringUtils.hasText(req.getCountry()))      trek.setCountry(req.getCountry().trim());
        if (req.getDifficulty()     != null)            trek.setDifficulty(req.getDifficulty());
        if (req.getDurationDays()   != null)            trek.setDurationDays(req.getDurationDays());
        if (req.getDistanceKm()     != null)            trek.setDistanceKm(req.getDistanceKm());
        if (req.getMaxAltitude()    != null)            trek.setMaxAltitude(req.getMaxAltitude());
        if (req.getSummitPoint()    != null)            trek.setSummitPoint(req.getSummitPoint().trim());
        if (req.getLatitude()       != null)            trek.setLatitude(req.getLatitude());
        if (req.getLongitude()      != null)            trek.setLongitude(req.getLongitude());
        if (req.getPickupPoint()    != null)            trek.setPickupPoint(req.getPickupPoint().trim());
        if (req.getDropPoint()      != null)            trek.setDropPoint(req.getDropPoint().trim());
        if (req.getCoverImageUrl()  != null)            trek.setCoverImageUrl(req.getCoverImageUrl().trim());
        if (req.getItineraryPdfUrl() != null)           trek.setItineraryPdfUrl(req.getItineraryPdfUrl().trim());
        if (req.getIncluded()       != null)            trek.setIncluded(req.getIncluded());
        if (req.getExcluded()       != null)            trek.setExcluded(req.getExcluded());
        if (req.getThingsToCarry()  != null)            trek.setThingsToCarry(req.getThingsToCarry());
        if (req.getCancellationPolicy() != null)        trek.setCancellationPolicy(req.getCancellationPolicy());
    }
}
