-- ============================================
-- TEMPORARY FIX: Disable RLS for Development
-- This allows signup to work while we debug
-- ============================================

-- Disable RLS on profiles table
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'RLS disabled on profiles table. Signup should work now.';
    RAISE NOTICE 'Remember to re-enable RLS in production!';
END $$;

-- ============================================
-- TO RE-ENABLE RLS LATER (for production):
-- ============================================
-- Uncomment and run these when ready:

/*
-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Add back the policies
CREATE POLICY "Enable read access for all users"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);
*/
