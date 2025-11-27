-- ============================================
-- UPDATED: Auto-create Profile on Signup
-- Sets onboarding_completed to FALSE by default
-- ============================================

-- Drop existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create updated function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, status, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
    'active',
    FALSE  -- Set onboarding as NOT completed
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update any existing profiles that don't have onboarding_completed set
UPDATE profiles 
SET onboarding_completed = FALSE 
WHERE onboarding_completed IS NULL AND role = 'buyer';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Auto-profile creation trigger updated!';
    RAISE NOTICE 'New buyers will have onboarding_completed = FALSE';
END $$;
