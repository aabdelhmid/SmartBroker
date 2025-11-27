-- SmartBroker Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'buyer', -- 'admin', 'agent', 'buyer', 'developer'
  phone TEXT,
  score INTEGER DEFAULT 50,
  status TEXT DEFAULT 'active', -- 'active', 'inactive'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- ============================================
-- 2. AREAS TABLE (static reference data)
-- ============================================
CREATE TABLE IF NOT EXISTS areas (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  city TEXT NOT NULL,
  city_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read areas
CREATE POLICY "Areas are viewable by everyone" 
  ON areas FOR SELECT 
  USING (true);

-- ============================================
-- 3. PROPERTIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Basic Info
  address TEXT NOT NULL,
  price NUMERIC NOT NULL,
  beds INTEGER,
  baths INTEGER,
  sqft INTEGER,
  type TEXT, -- 'villa', 'apartment', 'office', 'land'
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'needs_revision'
  
  -- Details
  description TEXT,
  description_ar TEXT,
  features TEXT[],
  images TEXT[],
  
  -- Relationships
  agent_id UUID REFERENCES profiles(id),
  area_id INTEGER REFERENCES areas(id),
  
  -- Discount
  discount_percentage NUMERIC DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100)
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view approved properties" 
  ON properties FOR SELECT 
  USING (status = 'approved');

CREATE POLICY "Agents can view their own properties" 
  ON properties FOR SELECT 
  USING (auth.uid() = agent_id);

CREATE POLICY "Agents can insert properties" 
  ON properties FOR INSERT 
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update own properties" 
  ON properties FOR UPDATE 
  USING (auth.uid() = agent_id);

CREATE POLICY "Admins can view all properties" 
  ON properties FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all properties" 
  ON properties FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 4. INTERESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS interests (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  property_id BIGINT REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'New', -- 'New', 'Approved', 'Rejected', 'Sent Back'
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  sent_back_at TIMESTAMPTZ,
  sent_back_reason TEXT
);

-- Enable RLS
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Buyers can view their own interests" 
  ON interests FOR SELECT 
  USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can insert interests" 
  ON interests FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Admins can view all interests" 
  ON interests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update interests" 
  ON interests FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 5. LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  property_id BIGINT REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  marketer_id UUID REFERENCES profiles(id),
  developer_id UUID REFERENCES profiles(id),
  
  status TEXT DEFAULT 'New', -- 'New', 'Contacted', 'Qualified', 'Closed Won', 'Closed Lost'
  deal_value NUMERIC,
  notes TEXT,
  
  approved_at TIMESTAMPTZ,
  assigned_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  
  interest_id BIGINT REFERENCES interests(id)
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Marketers can view assigned leads" 
  ON leads FOR SELECT 
  USING (auth.uid() = marketer_id OR auth.uid() = developer_id);

CREATE POLICY "Marketers can update assigned leads" 
  ON leads FOR UPDATE 
  USING (auth.uid() = marketer_id OR auth.uid() = developer_id);

CREATE POLICY "Admins can view all leads" 
  ON leads FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage leads" 
  ON leads FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 6. LEAD STATUS HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lead_status_history (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  updated_by UUID REFERENCES profiles(id),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE lead_status_history ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone involved in the lead can view history
CREATE POLICY "Lead participants can view history" 
  ON lead_status_history FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM leads 
      WHERE leads.id = lead_status_history.lead_id 
      AND (
        leads.marketer_id = auth.uid() 
        OR leads.developer_id = auth.uid()
        OR leads.buyer_id = auth.uid()
      )
    )
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 7. COMMISSION CLAIMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS commission_claims (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  property_id BIGINT REFERENCES properties(id),
  marketer_id UUID REFERENCES profiles(id),
  buyer_id UUID REFERENCES profiles(id),
  
  deal_value NUMERIC NOT NULL,
  commission_amount NUMERIC NOT NULL,
  commission_percentage NUMERIC NOT NULL,
  
  status TEXT DEFAULT 'Pending Admin Review', -- 'Pending Admin Review', 'Approved', 'Rejected'
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT
);

-- Enable RLS
ALTER TABLE commission_claims ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Marketers can view their claims" 
  ON commission_claims FOR SELECT 
  USING (auth.uid() = marketer_id);

CREATE POLICY "Admins can view all claims" 
  ON commission_claims FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update claims" 
  ON commission_claims FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 8. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_properties_updated_at 
  BEFORE UPDATE ON properties 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_area_id ON properties(area_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_interests_buyer_id ON interests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_interests_property_id ON interests(property_id);
CREATE INDEX IF NOT EXISTS idx_leads_marketer_id ON leads(marketer_id);
CREATE INDEX IF NOT EXISTS idx_leads_buyer_id ON leads(buyer_id);
CREATE INDEX IF NOT EXISTS idx_commission_claims_marketer_id ON commission_claims(marketer_id);

-- ============================================
-- 10. LEAD SCORING & MATCHING UPDATES
-- ============================================

-- Add preferences columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS budget_min NUMERIC,
ADD COLUMN IF NOT EXISTS budget_max NUMERIC,
ADD COLUMN IF NOT EXISTS preferred_locations TEXT[], -- Array of area slugs
ADD COLUMN IF NOT EXISTS preferred_property_types TEXT[], -- Array of types
ADD COLUMN IF NOT EXISTS buying_intent TEXT, -- 'cash', 'installments', 'mortgage'
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT FALSE;

-- Add adjacency to areas
ALTER TABLE areas
ADD COLUMN IF NOT EXISTS adjacent_area_ids INTEGER[]; -- Array of adjacent area IDs

-- Function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score()
RETURNS TRIGGER AS $$
DECLARE
    new_score INTEGER := 0;
BEGIN
    -- 1. Budget range selected (+30)
    IF NEW.budget_min IS NOT NULL OR NEW.budget_max IS NOT NULL THEN
        new_score := new_score + 30;
    END IF;

    -- 2. At least one preferred location (+20)
    IF NEW.preferred_locations IS NOT NULL AND array_length(NEW.preferred_locations, 1) > 0 THEN
        new_score := new_score + 20;
    END IF;

    -- 3. At least one property type (+20)
    IF NEW.preferred_property_types IS NOT NULL AND array_length(NEW.preferred_property_types, 1) > 0 THEN
        new_score := new_score + 20;
    END IF;

    -- 4. Buying intent selected (+10)
    IF NEW.buying_intent IS NOT NULL THEN
        new_score := new_score + 10;
    END IF;

    -- 5. Valid phone number (+10)
    IF NEW.phone IS NOT NULL AND length(NEW.phone) > 5 THEN
        new_score := new_score + 10;
    END IF;

    -- 6. Profile complete (+10)
    -- Assuming profile is complete if name and email are present (which are NOT NULL constraints)
    -- and at least one preference is set.
    IF NEW.name IS NOT NULL AND NEW.email IS NOT NULL THEN
         new_score := new_score + 10;
         NEW.is_profile_complete := TRUE;
    ELSE
         NEW.is_profile_complete := FALSE;
    END IF;

    -- Cap score at 100
    IF new_score > 100 THEN
        new_score := 100;
    END IF;

    NEW.score := new_score;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate score on profile update/insert
DROP TRIGGER IF EXISTS trigger_calculate_lead_score ON profiles;
CREATE TRIGGER trigger_calculate_lead_score
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION calculate_lead_score();
