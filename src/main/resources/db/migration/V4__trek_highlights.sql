-- ============================================================================
-- V4__trek_highlights.sql
-- Trek Highlights:
--   1. Create trek_highlights table
--   2. Indexes on trek_id and composite (trek_id, display_order)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Create trek_highlights
-- ----------------------------------------------------------------------------
CREATE TABLE trek_highlights (
    id            UUID         NOT NULL DEFAULT gen_random_uuid(),
    trek_id       UUID         NOT NULL,

    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    icon_name     VARCHAR(100),
    display_order INTEGER      NOT NULL DEFAULT 0,

    -- Audit columns consistent with BaseEntity
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by    VARCHAR(255),
    updated_by    VARCHAR(255),

    CONSTRAINT pk_trek_highlights PRIMARY KEY (id),
    CONSTRAINT fk_highlight_trek
        FOREIGN KEY (trek_id) REFERENCES treks (id) ON DELETE CASCADE,
    CONSTRAINT chk_highlight_display_order_non_negative
        CHECK (display_order >= 0)
);

-- ----------------------------------------------------------------------------
-- 2. Indexes
-- ----------------------------------------------------------------------------

-- Supports all queries scoped to a single trek
CREATE INDEX idx_highlight_trek_id
    ON trek_highlights (trek_id);

-- Supports ordered listing per trek (the most common query pattern)
CREATE INDEX idx_highlight_trek_display_order
    ON trek_highlights (trek_id, display_order);
