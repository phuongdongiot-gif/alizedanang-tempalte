-- Supabase Schema Initialization for Alize Project

-- 1. Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY,
    transaction_type TEXT,
    property_category TEXT,
    is_new BOOLEAN DEFAULT FALSE,
    name TEXT NOT NULL,
    project_id TEXT,
    project_name TEXT,
    price TEXT,
    price_num NUMERIC,
    location TEXT,
    type_details TEXT,
    area TEXT,
    area_num NUMERIC,
    beds INTEGER,
    baths INTEGER,
    description TEXT,
    img_url TEXT,
    gallery TEXT[], -- Array of strings
    coordinates JSONB, -- For lat, lng
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    date TIMESTAMP WITH TIME ZONE,
    title TEXT NOT NULL,
    description TEXT,
    img_url TEXT,
    content JSONB, -- Portable Text from Sanity is represented as JSON array
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Function to automatically update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

-- Triggers for properties and blogs
CREATE TRIGGER update_properties_modtime 
BEFORE UPDATE ON public.properties 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_blogs_modtime 
BEFORE UPDATE ON public.blogs 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- BẢNG LIÊN KẾT: Locations (Khu vực)
CREATE TABLE IF NOT EXISTS public.locations (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    hero_image TEXT,
    lat NUMERIC,
    lng NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Xoá bảng projects cũ để làm lại
DROP TABLE IF EXISTS public.project_floorplans;
DROP TABLE IF EXISTS public.project_amenities;
DROP TABLE IF EXISTS public.projects;

-- 3. Create projects (Mega-projects profile/Landing pages) table
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    location_id TEXT REFERENCES public.locations(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    hero_title TEXT,
    hero_desc TEXT,
    hero_img TEXT,
    overview_title TEXT,
    overview_desc TEXT,
    lat NUMERIC,
    lng NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER update_projects_modtime 
BEFORE UPDATE ON public.projects 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- 4. Bảng Tiện Ích (Amenities)
CREATE TABLE IF NOT EXISTS public.project_amenities (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Bảng Mặt Bằng (Floorplans)
CREATE TABLE IF NOT EXISTS public.project_floorplans (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    area TEXT,
    beds INTEGER,
    baths INTEGER,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Thêm Data ảo
INSERT INTO public.locations (id, slug, name) VALUES ('loc_dn', 'da-nang', 'Đà Nẵng') ON CONFLICT DO NOTHING;
