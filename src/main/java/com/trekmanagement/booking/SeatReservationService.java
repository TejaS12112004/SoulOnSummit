package com.trekmanagement.booking;

import java.util.UUID;

public interface SeatReservationService {

    /**
     * Reserves seats for a departure. Throws ValidationException if not enough seats available.
     */
    void reserve(UUID departureId, int count);

    /**
     * Releases seats for a departure, e.g. upon cancellation or expiry.
     */
    void release(UUID departureId, int count);
}
