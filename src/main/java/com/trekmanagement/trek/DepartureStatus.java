package com.trekmanagement.trek;

/**
 * Persisted status of a TrekDeparture.
 *
 * Only these three values are stored in the database.
 * Transient states (isFillingFast, isSoldOut) are computed in the service
 * layer and exposed in DepartureResponse — they are never persisted.
 */
public enum DepartureStatus {

    /** Booking is open and seats are available. Default on creation. */
    OPEN,

    /** Departure has been cancelled by an administrator. */
    CANCELLED,

    /**
     * The trek date has passed; departure is archived.
     * NOT settable via any admin API — this transition is owned by business
     * logic (a future scheduled job that runs once end_date has passed).
     * TrekDepartureServiceImpl rejects any manual request to set this status.
     */
    COMPLETED
}
