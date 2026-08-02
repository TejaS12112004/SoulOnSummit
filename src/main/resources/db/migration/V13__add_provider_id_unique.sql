-- Add UNIQUE constraint to provider_id in users table to prevent duplicate accounts
ALTER TABLE users ADD CONSTRAINT uk_users_provider_id UNIQUE (provider_id);
