CREATE TABLE trek_packing_items (
    id            UUID         NOT NULL DEFAULT gen_random_uuid(),
    trek_id       UUID         NOT NULL,
    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    display_order INTEGER      NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by    VARCHAR(255),
    updated_by    VARCHAR(255),

    CONSTRAINT pk_trek_packing_items PRIMARY KEY (id),
    CONSTRAINT fk_packing_item_trek
        FOREIGN KEY (trek_id) REFERENCES treks (id) ON DELETE CASCADE,
    CONSTRAINT chk_packing_item_display_order_non_negative
        CHECK (display_order >= 0)
);

CREATE INDEX idx_packing_item_trek_id
    ON trek_packing_items (trek_id);

CREATE INDEX idx_packing_item_trek_display_order
    ON trek_packing_items (trek_id, display_order);
