-- Trek Management System — Baseline Schema
-- V1__init_schema.sql
-- All tables use UUID PKs, timestamptz audit columns, and cascade rules per ER diagram.

-- ─────────────────────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
-- roles
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(50) NOT NULL UNIQUE CHECK (name IN ('ROLE_USER', 'ROLE_ADMIN')),
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by  VARCHAR(255),
    updated_by  VARCHAR(255)
);

INSERT INTO roles (id, name, description) VALUES
    (gen_random_uuid(), 'ROLE_USER',  'Standard customer account'),
    (gen_random_uuid(), 'ROLE_ADMIN', 'Platform administrator');

-- ─────────────────────────────────────────────────────────────────────────────
-- users
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE users (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id                  UUID NOT NULL REFERENCES roles(id),
    first_name               VARCHAR(100) NOT NULL,
    last_name                VARCHAR(100) NOT NULL,
    email                    VARCHAR(255) NOT NULL UNIQUE,
    phone                    VARCHAR(20)  UNIQUE,
    password_hash            VARCHAR(255) NOT NULL,
    profile_image_url        TEXT,
    date_of_birth            DATE,
    gender                   VARCHAR(20),
    emergency_contact_name   VARCHAR(100),
    emergency_contact_phone  VARCHAR(20),
    address                  TEXT,
    city                     VARCHAR(100),
    state                    VARCHAR(100),
    country                  VARCHAR(100),
    postal_code              VARCHAR(20),
    email_verified           BOOLEAN NOT NULL DEFAULT FALSE,
    is_active                BOOLEAN NOT NULL DEFAULT TRUE,
    failed_attempts          INTEGER NOT NULL DEFAULT 0,
    last_login               TIMESTAMPTZ,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by               VARCHAR(255),
    updated_by               VARCHAR(255)
);

CREATE INDEX idx_users_email   ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- refresh_tokens
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token   ON refresh_tokens(token);

-- ─────────────────────────────────────────────────────────────────────────────
-- email_verification_tokens
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE email_verification_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- password_reset_tokens
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE password_reset_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- treks
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE treks (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title                VARCHAR(255) NOT NULL,
    subtitle             VARCHAR(255),
    description          TEXT NOT NULL,
    location             VARCHAR(255) NOT NULL,
    state                VARCHAR(100),
    country              VARCHAR(100) NOT NULL DEFAULT 'India',
    difficulty           VARCHAR(20)  NOT NULL CHECK (difficulty IN ('EASY','MODERATE','DIFFICULT','EXTREME')),
    duration_days        INTEGER NOT NULL CHECK (duration_days > 0),
    distance_km          NUMERIC(8, 2),
    max_altitude         INTEGER,
    summit_point         VARCHAR(255),
    latitude             NUMERIC(10, 7),
    longitude            NUMERIC(10, 7),
    price                NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    discount_price       NUMERIC(10, 2),
    total_seats          INTEGER NOT NULL CHECK (total_seats > 0),
    available_seats      INTEGER NOT NULL CHECK (available_seats >= 0),
    start_date           DATE NOT NULL,
    end_date             DATE NOT NULL,
    pickup_point         VARCHAR(255),
    drop_point           VARCHAR(255),
    cover_image_url      TEXT,
    itinerary_pdf_url    TEXT,
    included             TEXT,
    excluded             TEXT,
    things_to_carry      TEXT,
    cancellation_policy  TEXT,
    featured             BOOLEAN NOT NULL DEFAULT FALSE,
    published            BOOLEAN NOT NULL DEFAULT FALSE,
    is_active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by           VARCHAR(255),
    updated_by           VARCHAR(255),
    CONSTRAINT chk_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_seats  CHECK (available_seats <= total_seats)
);

CREATE INDEX idx_treks_published  ON treks(published);
CREATE INDEX idx_treks_start_date ON treks(start_date);
CREATE INDEX idx_treks_difficulty ON treks(difficulty);

-- ─────────────────────────────────────────────────────────────────────────────
-- trek_images
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE trek_images (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trek_id       UUID NOT NULL REFERENCES treks(id) ON DELETE CASCADE,
    image_url     TEXT NOT NULL,
    caption       VARCHAR(255),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by    VARCHAR(255),
    updated_by    VARCHAR(255)
);

CREATE INDEX idx_trek_images_trek_id ON trek_images(trek_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- bookings
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE bookings (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference   VARCHAR(30) NOT NULL UNIQUE,
    user_id             UUID NOT NULL REFERENCES users(id),
    trek_id             UUID NOT NULL REFERENCES treks(id),
    number_of_people    INTEGER NOT NULL CHECK (number_of_people > 0),
    booking_status      VARCHAR(30) NOT NULL DEFAULT 'PAYMENT_PENDING'
                            CHECK (booking_status IN (
                                'PAYMENT_PENDING','CONFIRMED','PAYMENT_FAILED',
                                'CANCELLED','COMPLETED','ARCHIVED')),
    payment_status      VARCHAR(30) NOT NULL DEFAULT 'PENDING'
                            CHECK (payment_status IN ('PENDING','CAPTURED','FAILED','REFUNDED')),
    subtotal            NUMERIC(10, 2) NOT NULL,
    discount            NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax                 NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount        NUMERIC(10, 2) NOT NULL,
    special_requests    TEXT,
    medical_conditions  TEXT,
    invoice_url         TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by          VARCHAR(255),
    updated_by          VARCHAR(255),
    CONSTRAINT uq_user_trek_confirmed UNIQUE NULLS NOT DISTINCT (user_id, trek_id)
);

CREATE INDEX idx_bookings_user_id        ON bookings(user_id);
CREATE INDEX idx_bookings_trek_id        ON bookings(trek_id);
CREATE INDEX idx_bookings_status         ON bookings(booking_status);
CREATE INDEX idx_bookings_reference      ON bookings(booking_reference);

-- ─────────────────────────────────────────────────────────────────────────────
-- participants  (one row per person per booking)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE participants (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id        UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    full_name         VARCHAR(100) NOT NULL,
    age               INTEGER CHECK (age > 0),
    gender            VARCHAR(20),
    id_type           VARCHAR(50),
    government_id     VARCHAR(100),
    emergency_contact VARCHAR(100),
    medical_notes     TEXT,
    food_preference   VARCHAR(50),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by        VARCHAR(255),
    updated_by        VARCHAR(255)
);

CREATE INDEX idx_participants_booking_id ON participants(booking_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- payments
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE payments (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id           UUID NOT NULL REFERENCES bookings(id),
    razorpay_order_id    VARCHAR(100) UNIQUE,
    razorpay_payment_id  VARCHAR(100),
    razorpay_signature   TEXT,
    amount               NUMERIC(10, 2) NOT NULL,
    currency             VARCHAR(10) NOT NULL DEFAULT 'INR',
    payment_status       VARCHAR(30) NOT NULL DEFAULT 'PENDING'
                            CHECK (payment_status IN ('PENDING','CAPTURED','FAILED','REFUNDED')),
    refund_status        VARCHAR(30) CHECK (refund_status IN ('PENDING','PROCESSED','FAILED')),
    refund_amount        NUMERIC(10, 2),
    refund_id            VARCHAR(100),
    paid_at              TIMESTAMPTZ,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by           VARCHAR(255),
    updated_by           VARCHAR(255)
);

CREATE INDEX idx_payments_booking_id        ON payments(booking_id);
CREATE INDEX idx_payments_razorpay_order_id ON payments(razorpay_order_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- reviews
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE reviews (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trek_id    UUID NOT NULL REFERENCES treks(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users(id),
    rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title      VARCHAR(255),
    body       TEXT,
    approved   BOOLEAN NOT NULL DEFAULT FALSE,
    featured   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    CONSTRAINT uq_review_user_trek UNIQUE (user_id, trek_id)
);

CREATE INDEX idx_reviews_trek_id ON reviews(trek_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- blogs
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE blogs (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id      UUID NOT NULL REFERENCES users(id),
    title          VARCHAR(255) NOT NULL,
    slug           VARCHAR(255) NOT NULL UNIQUE,
    summary        VARCHAR(500),
    body           TEXT NOT NULL,
    featured_image TEXT,
    published      BOOLEAN NOT NULL DEFAULT FALSE,
    published_at   TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by     VARCHAR(255),
    updated_by     VARCHAR(255)
);

CREATE INDEX idx_blogs_slug      ON blogs(slug);
CREATE INDEX idx_blogs_published ON blogs(published);

-- ─────────────────────────────────────────────────────────────────────────────
-- gallery
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE gallery (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trek_id       UUID REFERENCES treks(id) ON DELETE SET NULL,
    image_url     TEXT NOT NULL,
    caption       VARCHAR(255),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by    VARCHAR(255),
    updated_by    VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- faqs
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE faqs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trek_id       UUID NOT NULL REFERENCES treks(id) ON DELETE CASCADE,
    question      TEXT NOT NULL,
    answer        TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by    VARCHAR(255),
    updated_by    VARCHAR(255)
);

CREATE INDEX idx_faqs_trek_id ON faqs(trek_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- notifications
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE notifications (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id        UUID REFERENCES bookings(id) ON DELETE SET NULL,
    notification_type VARCHAR(50) NOT NULL
                        CHECK (notification_type IN (
                            'REGISTRATION','BOOKING_CONFIRMATION','PAYMENT_CONFIRMATION',
                            'BOOKING_CANCELLATION','TREK_REMINDER','PASSWORD_RESET',
                            'EMAIL_VERIFICATION')),
    message           TEXT,
    sent_at           TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by        VARCHAR(255),
    updated_by        VARCHAR(255)
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
