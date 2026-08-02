-- Drop NOT NULL constraint on password_hash to allow OAuth2 users without local passwords
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Add provider_id for Google OAuth sub claim linking
ALTER TABLE users ADD COLUMN provider_id VARCHAR(255);
CREATE INDEX idx_users_provider_id ON users(provider_id);

-- Create table for secure, short-lived OAuth2 authorization codes
CREATE TABLE oauth2_codes (
    id BIGSERIAL PRIMARY KEY,
    code_hash VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_oauth2_codes_hash ON oauth2_codes(code_hash);
