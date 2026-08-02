package com.trekmanagement.trek;

import com.trekmanagement.common.dto.PageResponse;
import com.trekmanagement.trek.dto.CreateDepartureRequest;
import com.trekmanagement.trek.dto.DepartureResponse;
import com.trekmanagement.trek.dto.UpdateDepartureRequest;
import com.trekmanagement.trek.dto.UpcomingDepartureResponse;

import java.util.List;
import java.util.UUID;

public interface TrekDepartureService {

    // ── Admin operations ──────────────────────────────────────────────────────

    DepartureResponse createDeparture(UUID trekId, CreateDepartureRequest request);

    DepartureResponse updateDeparture(UUID trekId, UUID departureId, UpdateDepartureRequest request);

    void deleteDeparture(UUID trekId, UUID departureId);

    DepartureResponse changeStatus(UUID trekId, UUID departureId, DepartureStatus newStatus);

    /**
     * Duplicates all business fields from an existing departure.
     * Dates are copied as-is; admin must update dates immediately after.
     * Returns the newly created departure as 201 Created.
     */
    DepartureResponse duplicateDeparture(UUID trekId, UUID departureId);

    /** Returns all departures for a trek (any status), ordered startDate ASC. Admin use. */
    List<DepartureResponse> listDeparturesAdmin(UUID trekId);

    DepartureResponse getDepartureAdmin(UUID trekId, UUID departureId);

    // ── Public operations ─────────────────────────────────────────────────────

    /**
     * Returns only OPEN, active, future departures for a trek.
     * Ordered startDate ASC.
     * Used by the public trek detail batch selector.
     */
    List<DepartureResponse> listPublicDepartures(UUID trekId);

    /**
     * Returns ALL publicly visible upcoming departures across ALL published, active treks.
     * Paginated, ordered by startDate ASC.
     * Used by the public Upcoming Batches page (/batches).
     */
    PageResponse<UpcomingDepartureResponse> listPublicUpcoming(int page, int size);
}
