-- ============================================
-- COMPREHENSIVE MIGRATION: Add ALL Missing Columns
-- Run this in your Supabase SQL Editor
-- ============================================

-- Add ALL missing columns to profiles table
ALTER TABLE profiles 
-- Buyer-specific columns
ADD COLUMN IF NOT EXISTS budget_min NUMERIC,
ADD COLUMN IF NOT EXISTS budget_max NUMERIC,
ADD COLUMN IF NOT EXISTS preferred_locations TEXT[], -- Array of area slugs
ADD COLUMN IF NOT EXISTS preferred_property_types TEXT[], -- Array of types
ADD COLUMN IF NOT EXISTS buying_intent TEXT, -- 'cash', 'installments', 'mortgage'
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,

-- Marketer/Developer-specific columns
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS marketer_role TEXT, -- 'Marketer', 'Developer'
ADD COLUMN IF NOT EXISTS office_location TEXT,
ADD COLUMN IF NOT EXISTS cr_number TEXT; -- Commercial Registration

-- Add adjacent areas column for location matching
ALTER TABLE areas
ADD COLUMN IF NOT EXISTS adjacent_area_ids INTEGER[];

-- Create lead scoring function
CREATE OR REPLACE FUNCTION calculate_lead_score()
RETURNS TRIGGER AS $$
DECLARE
    new_score INTEGER := 0;
BEGIN
    -- Only calculate for buyers
    IF NEW.role = 'buyer' THEN
        -- Base score
        new_score := 50;
        
        -- Budget scoring (max 30 points)
        IF NEW.budget_max IS NOT NULL THEN
            IF NEW.budget_max >= 10000000 THEN
                new_score := new_score + 30;
            ELSIF NEW.budget_max >= 5000000 THEN
                new_score := new_score + 20;
            ELSIF NEW.budget_max >= 1000000 THEN
                new_score := new_score + 10;
            END IF;
        END IF;
        
        -- Location preference (10 points)
        IF NEW.preferred_locations IS NOT NULL AND array_length(NEW.preferred_locations, 1) > 0 THEN
            new_score := new_score + 10;
        END IF;
        
        -- Property type preference (5 points)
        IF NEW.preferred_property_types IS NOT NULL AND array_length(NEW.preferred_property_types, 1) > 0 THEN
            new_score := new_score + 5;
        END IF;
        
        -- Buying intent (5 points)
        IF NEW.buying_intent IS NOT NULL THEN
            new_score := new_score + 5;
        END IF;
        
        -- Profile completion bonus (10 points)
        IF NEW.is_profile_complete = TRUE THEN
            new_score := new_score + 10;
        END IF;
        
        -- Phone verification (10 points)
        IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN
            new_score := new_score + 10;
        END IF;
    END IF;

    NEW.score := new_score;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic score calculation
DROP TRIGGER IF EXISTS trigger_calculate_lead_score ON profiles;
CREATE TRIGGER trigger_calculate_lead_score
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION calculate_lead_score();

-- Update existing buyer profiles to calculate their scores
UPDATE profiles 
SET score = 50 
WHERE role = 'buyer' AND (score IS NULL OR score = 0);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully! All columns added.';
END $$;
