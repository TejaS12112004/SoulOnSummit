package com.trekmanagement.booking;

import com.trekmanagement.common.exception.ValidationException;
import com.trekmanagement.trek.TrekDepartureRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SeatReservationServiceImpl implements SeatReservationService {

    private final TrekDepartureRepository departureRepository;

    @Override
    @Transactional
    public void reserve(UUID departureId, int count) {
        int updatedRows = departureRepository.decrementAvailableSeats(departureId, count);
        if (updatedRows == 0) {
            log.warn("Failed to reserve {} seats for departure {}. Insufficient seats available.", count, departureId);
            throw new ValidationException("Not enough seats available for this departure");
        }
        log.info("Reserved {} seats for departure {}", count, departureId);
    }

    @Override
    @Transactional
    public void release(UUID departureId, int count) {
        departureRepository.incrementAvailableSeats(departureId, count);
        log.info("Released {} seats for departure {}", count, departureId);
    }
}
