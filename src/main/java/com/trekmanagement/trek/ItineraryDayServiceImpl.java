package com.trekmanagement.trek;

import com.trekmanagement.common.exception.ConflictException;
import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.trek.dto.CreateItineraryDayRequest;
import com.trekmanagement.trek.dto.ItineraryDayResponse;
import com.trekmanagement.trek.dto.UpdateItineraryDayRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ItineraryDayServiceImpl implements ItineraryDayService {

    private final TrekItineraryDayRepository itineraryDayRepository;
    private final TrekRepository trekRepository;
    private final ItineraryDayMapper itineraryDayMapper;

    // ── Admin operations ──────────────────────────────────────────────────────

    @Override
    @Transactional
    public ItineraryDayResponse createItineraryDay(UUID trekId, CreateItineraryDayRequest request) {
        Trek trek = findTrek(trekId);

        // Enforce the unique (trek_id, day_number) constraint at the service layer
        // to return a meaningful 409 rather than a database constraint violation.
        boolean dayExists = itineraryDayRepository
                .findByTrekIdOrderByDisplayOrderAsc(trekId)
                .stream()
                .anyMatch(d -> d.getDayNumber().equals(request.getDayNumber()));
        if (dayExists) {
            throw new ConflictException(
                    "An itinerary day with day number " + request.getDayNumber()
                    + " already exists for this trek");
        }

        TrekItineraryDay day = new TrekItineraryDay();
        day.setTrek(trek);
        day.setDayNumber(request.getDayNumber());
        day.setTitle(request.getTitle());
        day.setDescription(request.getDescription());
        day.setStay(request.getStay());
        day.setMeals(request.getMeals());
        day.setDistanceKm(request.getDistanceKm());
        day.setDurationHours(request.getDurationHours());
        day.setAltitude(request.getAltitude());
        day.setImageUrl(request.getImageUrl());
        day.setDisplayOrder(request.getDisplayOrder());

        TrekItineraryDay saved = itineraryDayRepository.save(day);
        return itineraryDayMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItineraryDayResponse> listItineraryAdmin(UUID trekId) {
        assertTrekExists(trekId);
        List<TrekItineraryDay> days = itineraryDayRepository.findByTrekIdOrderByDisplayOrderAsc(trekId);
        return itineraryDayMapper.toResponseList(days);
    }

    @Override
    @Transactional
    public ItineraryDayResponse updateItineraryDay(UUID dayId, UpdateItineraryDayRequest request) {
        TrekItineraryDay day = findItineraryDay(dayId);

        // If a new dayNumber is supplied, verify it doesn't clash with a different day on the same trek.
        if (request.getDayNumber() != null && !request.getDayNumber().equals(day.getDayNumber())) {
            boolean dayExists = itineraryDayRepository
                    .findByTrekIdOrderByDisplayOrderAsc(day.getTrek().getId())
                    .stream()
                    .anyMatch(d -> !d.getId().equals(dayId)
                               && d.getDayNumber().equals(request.getDayNumber()));
            if (dayExists) {
                throw new ConflictException(
                        "An itinerary day with day number " + request.getDayNumber()
                        + " already exists for this trek");
            }
            day.setDayNumber(request.getDayNumber());
        }

        if (StringUtils.hasText(request.getTitle()))       day.setTitle(request.getTitle());
        if (StringUtils.hasText(request.getDescription())) day.setDescription(request.getDescription());
        if (request.getStay()          != null)            day.setStay(request.getStay());
        if (request.getMeals()         != null)            day.setMeals(request.getMeals());
        if (request.getDistanceKm()    != null)            day.setDistanceKm(request.getDistanceKm());
        if (request.getDurationHours() != null)            day.setDurationHours(request.getDurationHours());
        if (request.getAltitude()      != null)            day.setAltitude(request.getAltitude());
        if (request.getImageUrl()      != null)            day.setImageUrl(request.getImageUrl());
        if (request.getDisplayOrder()  != null)            day.setDisplayOrder(request.getDisplayOrder());

        TrekItineraryDay saved = itineraryDayRepository.save(day);
        return itineraryDayMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteItineraryDay(UUID dayId) {
        TrekItineraryDay day = findItineraryDay(dayId);
        itineraryDayRepository.delete(day);
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

    private TrekItineraryDay findItineraryDay(UUID dayId) {
        return itineraryDayRepository.findById(dayId)
                .orElseThrow(() -> new ResourceNotFoundException("ItineraryDay", dayId));
    }
}
