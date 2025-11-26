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
