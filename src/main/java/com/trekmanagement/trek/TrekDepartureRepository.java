package com.trekmanagement.trek;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrekDepartureRepository extends JpaRepository<TrekDeparture, UUID> {

    /**
     * All departures for a given trek, ordered by startDate ascending.
     * Used by admin detail view.
     */
    List<TrekDeparture> findByTrekIdOrderByStartDateAsc(UUID trekId);

    /**
     * Active, OPEN departures for a given trek with a future start date,
     * ordered by startDate ascending.
     * Used by public trek detail (batch selector) and publishing guard.
     */
    List<TrekDeparture> findByTrekIdAndStatusAndIsActiveTrueAndStartDateAfterOrderByStartDateAsc(
            UUID trekId, DepartureStatus status, LocalDate after);

    /**
     * Single departure belonging to a specific trek.
     * Used for ownership validation before update/delete/duplicate.
     */
    Optional<TrekDeparture> findByIdAndTrekId(UUID id, UUID trekId);

    /**
     * Publishing guard: checks whether at least one active OPEN future departure exists.
     */
    boolean existsByTrekIdAndStatusAndIsActiveTrueAndStartDateAfter(
            UUID trekId, DepartureStatus status, LocalDate after);

    /**
     * Decrement available seats atomically. This — along with incrementAvailableSeats
     * below — is the ONLY sanctioned way to change availableSeats once booking exists;
     * see the field-level doc on TrekDeparture.availableSeats.
     * Returns the number of rows updated (0 = insufficient seats — caller must check).
     * Used by the Booking module when it is built.
     */
    @Modifying
    @Query("""
            UPDATE TrekDeparture d
               SET d.availableSeats = d.availableSeats - :count
             WHERE d.id = :id
               AND d.availableSeats >= :count
            """)
    int decrementAvailableSeats(@Param("id") UUID id, @Param("count") int count);

    /**
     * Restore available seats on booking cancellation. Sanctioned mutation path —
     * see the field-level doc on TrekDeparture.availableSeats.
     * Used by the Booking module when it is built.
     */
    @Modifying
    @Query("""
            UPDATE TrekDeparture d
               SET d.availableSeats = d.availableSeats + :count
             WHERE d.id = :id
            """)
    void incrementAvailableSeats(@Param("id") UUID id, @Param("count") int count);

    /**
     * Soft-delete all departures for a trek when the trek itself is soft-deleted.
     */
    @Modifying
    @Query("UPDATE TrekDeparture d SET d.isActive = false WHERE d.trek.id = :trekId")
    void deactivateAllByTrekId(@Param("trekId") UUID trekId);

    @Query("SELECT d FROM TrekDeparture d WHERE d.trek.id = :trekId AND d.status = 'OPEN' AND d.startDate >= :today ORDER BY d.startDate ASC")
    List<TrekDeparture> findOpenUpcomingDepartures(@Param("trekId") UUID trekId, @Param("today") LocalDate today);

    @Query("SELECT COUNT(d) FROM TrekDeparture d WHERE d.isActive = true AND d.trek.published = true AND d.status = :status AND d.startDate >= :date")
    long countUpcomingActiveDepartures(@Param("status") DepartureStatus status, @Param("date") LocalDate date);

    List<TrekDeparture> findTop5ByStatusAndIsActiveTrueAndTrekPublishedTrueAndStartDateGreaterThanEqualOrderByStartDateAsc(DepartureStatus status, LocalDate after);

    /**
     * Returns all publicly visible upcoming departures across ALL published, active treks.
     * Filters:
     *   - departure.isActive = true          (not soft-deleted)
     *   - departure.status = OPEN            (CANCELLED/COMPLETED excluded)
     *   - trek.published = true              (public trek visibility)
     *   - trek.isActive = true               (not soft-deleted trek)
     *   - departure.startDate >= :today      (future departures only)
     *
     * JOIN FETCH on d.trek avoids N+1 when mapping trek fields into the DTO.
     * Ordered by startDate ASC so oldest upcoming batch appears first.
     *
     * Used by: GET /api/v1/treks/departures/upcoming (public, paginated)
     */
    @Query("""
            SELECT d FROM TrekDeparture d
            JOIN FETCH d.trek t
            WHERE d.isActive = true
              AND d.status = 'OPEN'
              AND t.published = true
              AND t.isActive = true
              AND d.startDate >= :today
            ORDER BY d.startDate ASC
            """)
    Page<TrekDeparture> findPublicUpcoming(@Param("today") LocalDate today, Pageable pageable);
}
