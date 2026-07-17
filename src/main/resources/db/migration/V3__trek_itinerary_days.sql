-- ============================================================================
-- V3__trek_itinerary_days.sql
-- Trek Day-wise Itinerary:
--   1. Create trek_itinerary_days table
--   2. Indexes on trek_id and composite (trek_id, display_order)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Create trek_itinerary_days
-- ----------------------------------------------------------------------------
CREATE TABLE trek_itinerary_days (
    id             UUID         NOT NULL DEFAULT gen_random_uuid(),
    trek_id        UUID         NOT NULL,

    day_number     INTEGER      NOT NULL,
    title          TEXT         NOT NULL,
    description    TEXT         NOT NULL,
    stay           VARCHAR(255),
    meals          VARCHAR(255),
    distance_km    NUMERIC(8, 2),
    duration_hours NUMERIC(5, 2),
    altitude       INTEGER,
    image_url      TEXT,
    display_order  INTEGER      NOT NULL DEFAULT 0,

    -- Audit columns consistent with BaseEntity
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by     VARCHAR(255),
    updated_by     VARCHAR(255),

    CONSTRAINT pk_trek_itinerary_days     PRIMARY KEY (id),
    CONSTRAINT fk_itinerary_day_trek
        FOREIGN KEY (trek_id) REFERENCES treks (id) ON DELETE CASCADE,
    CONSTRAINT uq_itinerary_trek_day_number
        UNIQUE (trek_id, day_number),
    CONSTRAINT chk_itinerary_day_number_positive
        CHECK (day_number >= 1),
    CONSTRAINT chk_itinerary_display_order_non_negative
        CHECK (display_order >= 0)
);

-- ----------------------------------------------------------------------------
-- 2. Indexes
-- ----------------------------------------------------------------------------

-- Supports all queries scoped to a single trek (list by trek)
CREATE INDEX idx_itinerary_trek_id
    ON trek_itinerary_days (trek_id);

-- Supports ordered listing per trek (the most common query pattern)
CREATE INDEX idx_itinerary_trek_display_order
    ON trek_itinerary_days (trek_id, display_order);
