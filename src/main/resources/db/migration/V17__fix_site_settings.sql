-- Fix created_by and updated_by types in site_settings
ALTER TABLE site_settings DROP CONSTRAINT IF EXISTS site_settings_created_by_fkey;
ALTER TABLE site_settings DROP CONSTRAINT IF EXISTS site_settings_updated_by_fkey;

ALTER TABLE site_settings ALTER COLUMN created_by TYPE VARCHAR(255);
ALTER TABLE site_settings ALTER COLUMN updated_by TYPE VARCHAR(255);
