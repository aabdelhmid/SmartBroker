-- ============================================
-- FINAL FIX: Simplified RLS Policy for Profiles
-- This allows authenticated users to create their profile
-- ============================================

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Create new simplified policies

-- 1. Anyone can view profiles (needed for public property listings)
CREATE POLICY "Enable read access for all users"
ON profiles FOR SELECT
USING (true);

-- 2. Authenticated users can insert their own profile (for signup)
CREATE POLICY "Enable insert for authenticated users"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 3. Users can update their own profile
CREATE POLICY "Enable update for users based on user_id"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Users can delete their own profile (optional, for account deletion)
CREATE POLICY "Enable delete for users based on user_id"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Verify RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'RLS policies updated successfully!';
END $$;
