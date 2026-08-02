CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- General / Company
    company_name VARCHAR(255),
    support_email VARCHAR(255),
    support_phone VARCHAR(50),
    business_address TEXT,
    
    -- Social Media
    instagram_url VARCHAR(1024),
    facebook_url VARCHAR(1024),
    youtube_url VARCHAR(1024),
    twitter_url VARCHAR(1024),
    
    -- Default SEO
    default_meta_title VARCHAR(255),
    default_meta_description TEXT,
    
    -- Branding
    logo_url VARCHAR(1024),
    favicon_url VARCHAR(1024),
    
    -- BaseEntity Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Singleton constraint: Ensure only one row can exist.
CREATE UNIQUE INDEX idx_site_settings_single_row ON site_settings ((1));

-- Seed the initial empty singleton row
INSERT INTO site_settings (
    company_name, 
    support_email, 
    support_phone, 
    business_address, 
    default_meta_title, 
    default_meta_description
) VALUES (
    'TrekManagement', 
    'support@example.com', 
    '', 
    '', 
    'TrekManagement - Adventure Awaits', 
    'Book your next trekking adventure.'
);
