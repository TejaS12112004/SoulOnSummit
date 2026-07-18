CREATE SEQUENCE booking_ref_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(30) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    departure_id UUID NOT NULL REFERENCES trek_departures(id),
    status VARCHAR(20) NOT NULL,
    booking_source VARCHAR(20) NOT NULL,
    total_participants INT NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL,
    special_requests TEXT,
    booked_at TIMESTAMPTZ NOT NULL,
    payment_due_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_departure_id ON bookings(departure_id);
CREATE INDEX idx_bookings_status ON bookings(status);
