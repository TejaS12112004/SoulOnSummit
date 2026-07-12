package com.trekmanagement.trek;

import com.trekmanagement.common.exception.ConflictException;
import com.trekmanagement.common.exception.ResourceNotFoundException;
import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.trek.dto.CreateDepartureRequest;
import com.trekmanagement.trek.dto.DepartureResponse;
import com.trekmanagement.trek.dto.UpdateDepartureRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrekDepartureServiceImpl implements TrekDepartureService {

    private final TrekDepartureRepository departureRepository;
    private final TrekRepository trekRepository;
    private final TrekDepartureMapper departureMapper;

    // ── Admin operations ──────────────────────────────────────────────────────

    @Override
    @Transactional
    public DepartureResponse createDeparture(UUID trekId, CreateDepartureRequest request) {
        Trek trek = findActiveTrek(trekId);

        validateDateTriple(
                request.getStartDate(),
                request.getEndDate(),
                request.getRegistrationDeadline()
        );

        int effectiveTotalSeats = request.getTotalSeats();
        int effectiveAvailableSeats = request.getAvailableSeats() != null
                ? request.getAvailableSeats()
                : effectiveTotalSeats;

        if (effectiveAvailableSeats > effectiveTotalSeats) {
            throw new ValidationException(
                    "Available seats (" + effectiveAvailableSeats +
                    ") cannot exceed total seats (" + effectiveTotalSeats + ")");
        }

        validatePricing(request.getPrice(), request.getDiscountPrice());
        validateAvailableSeatsNonNegative(effectiveAvailableSeats);

        TrekDeparture departure = new TrekDeparture();
        departure.setTrek(trek);
        departure.setStartDate(request.getStartDate());
        departure.setEndDate(request.getEndDate());
        departure.setRegistrationDeadline(request.getRegistrationDeadline());
        departure.setPrice(request.getPrice());
        departure.setDiscountPrice(request.getDiscountPrice());
        departure.setTotalSeats(effectiveTotalSeats);
        departure.setAvailableSeats(effectiveAvailableSeats);
        departure.setStatus(DepartureStatus.OPEN);
        departure.setActive(true);

        TrekDeparture saved = departureRepository.save(departure);
        return departureMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public DepartureResponse updateDeparture(UUID trekId, UUID departureId,
                                              UpdateDepartureRequest request) {
        TrekDeparture departure = findDeparture(trekId, departureId);

        // Resolve effective dates — use requested value if present, else current persisted value
        LocalDate effectiveStart    = request.getStartDate()            != null
                ? request.getStartDate()            : departure.getStartDate();
        LocalDate effectiveEnd      = request.getEndDate()              != null
                ? request.getEndDate()              : departure.getEndDate();
        LocalDate effectiveDeadline = request.getRegistrationDeadline() != null
                ? request.getRegistrationDeadline() : departure.getRegistrationDeadline();

        validateDateTriple(effectiveStart, effectiveEnd, effectiveDeadline);

        // Resolve effective pricing
        BigDecimal effectivePrice    = request.getPrice()         != null
                ? request.getPrice()         : departure.getPrice();
        BigDecimal effectiveDiscount = request.getDiscountPrice() != null
                ? request.getDiscountPrice() : departure.getDiscountPrice();

        validatePricing(effectivePrice, effectiveDiscount);

        // Seat update — protect against reducing below booked count
        if (request.getTotalSeats() != null) {
            int bookedSeats = departure.getTotalSeats() - departure.getAvailableSeats();
            int newTotal    = request.getTotalSeats();
            if (newTotal < bookedSeats) {
                throw new ValidationException(
                        "Cannot reduce total seats below already-booked count (" + bookedSeats + ")");
            }
            departure.setTotalSeats(newTotal);

            // If availableSeats also explicitly provided, validate it
            if (request.getAvailableSeats() != null) {
                if (request.getAvailableSeats() > newTotal) {
                    throw new ValidationException(
                            "Available seats cannot exceed updated total seats (" + newTotal + ")");
                }
                departure.setAvailableSeats(request.getAvailableSeats());
            } else {
                // Recalculate available seats proportionally
                departure.setAvailableSeats(newTotal - bookedSeats);
            }
        } else if (request.getAvailableSeats() != null) {
            if (request.getAvailableSeats() > departure.getTotalSeats()) {
                throw new ValidationException(
                        "Available seats cannot exceed total seats (" + departure.getTotalSeats() + ")");
            }
            departure.setAvailableSeats(request.getAvailableSeats());
        }

        // Apply remaining fields
        departure.setStartDate(effectiveStart);
        departure.setEndDate(effectiveEnd);
        departure.setRegistrationDeadline(effectiveDeadline);
        departure.setPrice(effectivePrice);
        departure.setDiscountPrice(effectiveDiscount);

        if (request.getStatus() != null) {
            if (request.getStatus() == DepartureStatus.COMPLETED) {
                throw new ValidationException(
                        "Status COMPLETED cannot be set manually — it is determined by business logic " +
                        "(a scheduled job) once the departure's end date has passed.");
            }
            departure.setStatus(request.getStatus());
        }

        validateAvailableSeatsNonNegative(departure.getAvailableSeats());

        TrekDeparture saved = departureRepository.save(departure);
        return departureMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteDeparture(UUID trekId, UUID departureId) {
        TrekDeparture departure = findDeparture(trekId, departureId);

        // Soft-delete: mark inactive, leave row for audit trail
        departure.setActive(false);
        departureRepository.save(departure);
    }

    @Override
    @Transactional
    public DepartureResponse changeStatus(UUID trekId, UUID departureId,
                                           DepartureStatus newStatus) {
        TrekDeparture departure = findDeparture(trekId, departureId);

        if (newStatus == DepartureStatus.COMPLETED) {
            throw new ValidationException(
                    "Status COMPLETED cannot be set manually — it is determined by business logic " +
                    "(a scheduled job) once the departure's end date has passed, not by admin action.");
        }

        if (departure.getStatus() == newStatus) {
            throw new ConflictException(
                    "Departure is already in status: " + newStatus.name());
        }

        departure.setStatus(newStatus);
        TrekDeparture saved = departureRepository.save(departure);
        return departureMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public DepartureResponse duplicateDeparture(UUID trekId, UUID departureId) {
        TrekDeparture source = findDeparture(trekId, departureId);

        // Copy all business fields as-is; admin edits dates immediately after
        TrekDeparture copy = new TrekDeparture();
        copy.setTrek(source.getTrek());
        copy.setStartDate(source.getStartDate());
        copy.setEndDate(source.getEndDate());
        copy.setRegistrationDeadline(source.getRegistrationDeadline());
        copy.setPrice(source.getPrice());
        copy.setDiscountPrice(source.getDiscountPrice());
        copy.setTotalSeats(source.getTotalSeats());
        copy.setAvailableSeats(source.getAvailableSeats());
        copy.setStatus(DepartureStatus.OPEN);
        copy.setActive(true);

        TrekDeparture saved = departureRepository.save(copy);
        return departureMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartureResponse> listDeparturesAdmin(UUID trekId) {
        assertTrekExists(trekId);
        List<TrekDeparture> departures =
                departureRepository.findByTrekIdOrderByStartDateAsc(trekId);
        return departureMapper.toResponseList(departures);
    }

    @Override
    @Transactional(readOnly = true)
    public DepartureResponse getDepartureAdmin(UUID trekId, UUID departureId) {
        TrekDeparture departure = findDeparture(trekId, departureId);
        return departureMapper.toResponse(departure);
    }

    // ── Public operations ─────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<DepartureResponse> listPublicDepartures(UUID trekId) {
        // Trek must be published and active
        trekRepository.findByIdAndPublishedTrueAndIsActiveTrue(trekId)
                .orElseThrow(() -> new ResourceNotFoundException("Trek", trekId));

        List<TrekDeparture> departures =
                departureRepository
                        .findByTrekIdAndStatusAndIsActiveTrueAndStartDateAfterOrderByStartDateAsc(
                                trekId, DepartureStatus.OPEN, LocalDate.now());
        return departureMapper.toResponseList(departures);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private Trek findActiveTrek(UUID trekId) {
        return trekRepository.findById(trekId)
                .filter(Trek::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Trek", trekId));
    }

    private void assertTrekExists(UUID trekId) {
        if (!trekRepository.existsById(trekId)) {
            throw new ResourceNotFoundException("Trek", trekId);
        }
    }

    private TrekDeparture findDeparture(UUID trekId, UUID departureId) {
        return departureRepository.findByIdAndTrekId(departureId, trekId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "TrekDeparture with id " + departureId +
                        " not found for trek " + trekId));
    }

    /**
     * Validates the three-date rule:
     *   registrationDeadline < startDate < endDate
     */
    private void validateDateTriple(LocalDate startDate,
                                     LocalDate endDate,
                                     LocalDate registrationDeadline) {
        if (!endDate.isAfter(startDate)) {
            throw new ValidationException(
                    "End date (" + endDate + ") must be after start date (" + startDate + ")");
        }
        if (!registrationDeadline.isBefore(startDate)) {
            throw new ValidationException(
                    "Registration deadline (" + registrationDeadline +
                    ") must be before start date (" + startDate + ")");
        }
    }

    /**
     * Validates discount price does not exceed full price.
     */
    private void validatePricing(BigDecimal price, BigDecimal discountPrice) {
        if (discountPrice != null && discountPrice.compareTo(price) > 0) {
            throw new ValidationException(
                    "Discount price (" + discountPrice +
                    ") must not exceed the full price (" + price + ")");
        }
    }

    /**
     * Defense-in-depth check: availableSeats must never go negative before persistence,
     * regardless of DTO-level @Min(0) validation (which does not cover values computed
     * internally, e.g. total - booked during an update).
     */
    private void validateAvailableSeatsNonNegative(int availableSeats) {
        if (availableSeats < 0) {
            throw new ValidationException("Available seats must not be negative");
        }
    }
}
