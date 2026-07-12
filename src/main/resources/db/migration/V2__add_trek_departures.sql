-- ============================================================================
-- V2__add_trek_departures.sql
-- TrekDeparture refactor:
--   1. Create trek_departures table
--   2. Pre-flight integrity check (fails loudly if required data is missing —
--      never fabricates placeholder dates/prices/seats)
--   3. Migrate existing per-trek date/price/seat data → one departure per trek
--   4. Drop the migrated columns from treks
--   5. Indexes, including composite (trek_id, start_date)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Create trek_departures
-- ----------------------------------------------------------------------------
CREATE TABLE trek_departures (
    id                    UUID        NOT NULL DEFAULT gen_random_uuid(),
    trek_id               UUID        NOT NULL,
    start_date            DATE        NOT NULL,
    end_date              DATE        NOT NULL,
    registration_deadline DATE        NOT NULL,
    price                 NUMERIC(10, 2) NOT NULL,
    discount_price        NUMERIC(10, 2),
    total_seats           INTEGER     NOT NULL,
    available_seats       INTEGER     NOT NULL,
    status                VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    is_active             BOOLEAN     NOT NULL DEFAULT TRUE,

    -- Optimistic locking (JPA @Version) to prevent concurrent seat-booking races
    version     BIGINT      NOT NULL DEFAULT 0,

    -- Audit columns consistent with BaseEntity
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by  VARCHAR(255),
    updated_by  VARCHAR(255),

    CONSTRAINT pk_trek_departures PRIMARY KEY (id),
    CONSTRAINT fk_departure_trek
        FOREIGN KEY (trek_id) REFERENCES treks(id) ON DELETE CASCADE,
    CONSTRAINT chk_departure_status
        CHECK (status IN ('OPEN', 'CANCELLED', 'COMPLETED')),
    CONSTRAINT chk_departure_end_after_start
        CHECK (end_date > start_date),
    CONSTRAINT chk_departure_deadline_before_start
        CHECK (registration_deadline < start_date),
    CONSTRAINT chk_departure_discount_lte_price
        CHECK (discount_price IS NULL OR discount_price <= price),
    CONSTRAINT chk_departure_total_seats_positive
        CHECK (total_seats > 0),
    CONSTRAINT chk_departure_available_lte_total
        CHECK (available_seats >= 0 AND available_seats <= total_seats)
);

-- ----------------------------------------------------------------------------
-- 2. Pre-flight integrity check
--
--    This migration must preserve real data only. It must NOT fabricate
--    placeholder dates, prices, or seat counts. If any existing trek is
--    missing a value required to construct its departure row, the migration
--    fails loudly here rather than silently inserting made-up data.
--
--    (In the current schema these columns are NOT NULL on `treks`, so this
--    check is expected to always pass — it exists as an explicit guard
--    against ever inserting fabricated data if that assumption changes.)
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    missing_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO missing_count
    FROM treks t
    WHERE t.start_date IS NULL
       OR t.end_date IS NULL
       OR t.price IS NULL
       OR t.total_seats IS NULL
       OR t.available_seats IS NULL;

    IF missing_count > 0 THEN
        RAISE EXCEPTION
            'Migration V2 aborted: % trek(s) are missing required start_date/end_date/price/total_seats/available_seats. Fix this data before migrating — no placeholder values will be inserted.',
            missing_count;
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 3. Migrate existing trek data → one departure per trek (real values only)
--
--    registration_deadline = start_date - 7 days is a ONE-TIME migration
--    default used ONLY here, to backfill this now-mandatory field for
--    departures created from pre-existing trek rows that predate it.
--    It always satisfies the "before start_date" CHECK since start_date is
--    real (guaranteed by the pre-flight check above).
--    New departures created going forward via the admin API MUST supply
--    registration_deadline explicitly — see CreateDepartureRequest, which
--    has no fallback/default in application code.
-- ----------------------------------------------------------------------------
INSERT INTO trek_departures (
    id,
    trek_id,
    start_date,
    end_date,
    registration_deadline,
    price,
    discount_price,
    total_seats,
    available_seats,
    status,
    is_active,
    created_at,
    updated_at,
    created_by,
    updated_by
)
SELECT
    gen_random_uuid(),
    t.id,
    t.start_date,
    t.end_date,
    t.start_date - INTERVAL '7 days',
    t.price,
    t.discount_price,
    t.total_seats,
    t.available_seats,
    'OPEN',
    TRUE,
    NOW(),
    NOW(),
    'system-migration',
    'system-migration'
FROM treks t;

-- ----------------------------------------------------------------------------
-- 4. Drop migrated columns from treks
--    The CHECK constraints on these columns (chk_dates, chk_seats) are
--    automatically removed when the columns are dropped.
-- ----------------------------------------------------------------------------
ALTER TABLE treks DROP COLUMN IF EXISTS start_date;
ALTER TABLE treks DROP COLUMN IF EXISTS end_date;
ALTER TABLE treks DROP COLUMN IF EXISTS price;
ALTER TABLE treks DROP COLUMN IF EXISTS discount_price;
ALTER TABLE treks DROP COLUMN IF EXISTS total_seats;
ALTER TABLE treks DROP COLUMN IF EXISTS available_seats;

-- ----------------------------------------------------------------------------
-- 5. Indexes on trek_departures
-- ----------------------------------------------------------------------------
CREATE INDEX idx_trek_departures_trek_id
    ON trek_departures(trek_id);

CREATE INDEX idx_trek_departures_start_date
    ON trek_departures(start_date);

CREATE INDEX idx_trek_departures_status
    ON trek_departures(status);

-- Composite index to optimize the most common departure query pattern
-- (look up a trek's departures ordered by date):
CREATE INDEX idx_trek_departures_trek_start
    ON trek_departures(trek_id, start_date);

-- Composite index for the public listing query:
--   trek_id + status + is_active + start_date
CREATE INDEX idx_trek_departures_public_listing
    ON trek_departures(trek_id, status, is_active, start_date)
    WHERE status = 'OPEN' AND is_active = TRUE;
