package com.trekmanagement.trek;

import com.trekmanagement.trek.dto.CreateItineraryDayRequest;
import com.trekmanagement.trek.dto.ItineraryDayResponse;
import com.trekmanagement.trek.dto.UpdateItineraryDayRequest;

import java.util.List;
import java.util.UUID;

public interface ItineraryDayService {

    // ── Admin operations ──────────────────────────────────────────────────────

    ItineraryDayResponse createItineraryDay(UUID trekId, CreateItineraryDayRequest request);

    /** Returns all itinerary days for a trek, ordered displayOrder ASC. Admin use. */
    List<ItineraryDayResponse> listItineraryAdmin(UUID trekId);

    ItineraryDayResponse updateItineraryDay(UUID dayId, UpdateItineraryDayRequest request);

    void deleteItineraryDay(UUID dayId);
}
