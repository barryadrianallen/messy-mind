
-- Create the profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  username TEXT UNIQUE,
  role TEXT CHECK (role IN ('parent', 'child')),
  avatar_url TEXT
);

-- Add comments to the table and columns for clarity
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user.';
COMMENT ON COLUMN public.profiles.id IS 'References the internal Supabase auth.users table.';
COMMENT ON COLUMN public.profiles.full_name IS 'User''s full name.';
COMMENT ON COLUMN public.profiles.username IS 'User''s unique username.';
COMMENT ON COLUMN public.profiles.role IS 'User''s role in the application (parent or child).';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL for the user''s avatar image.';

-- Enable Row Level Security for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- POLICY: Users can view their own profile
CREATE POLICY "Allow individual user read access to their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- POLICY: Users can update their own profile
CREATE POLICY "Allow individual user update access to their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- POLICY: Users can insert their own profile row.
-- This policy allows a user to insert their own profile directly.
-- For a more robust setup, profile creation is often handled by a trigger 
-- on the auth.users table (on new user creation) or via a server-side function 
-- called after sign-up to ensure data integrity and assign default values if needed.
CREATE POLICY "Allow individual user to insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Optional: Function and Trigger to create a profile when a new user signs up in auth.users
-- This is a common pattern to automatically create a corresponding profile entry.

-- Function to create a new profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'role');
  RETURN NEW;
END;
$$;

-- Trigger to call the function after a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant usage on the new function to the authenticated role
-- This might be needed if your RLS policies depend on functions being callable by users.
-- However, for a SECURITY DEFINER function triggered by auth.users, this might not be strictly necessary for the trigger itself.
-- GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;