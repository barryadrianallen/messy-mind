-- Add hashed_pin column to public.profiles table
ALTER TABLE public.profiles
ADD COLUMN hashed_pin TEXT;

-- Add a comment for the new column
COMMENT ON COLUMN public.profiles.hashed_pin IS 'Stores the hashed PIN for child users.';

-- Potentially update RLS policies if needed.
-- For now, the existing policies for SELECT and UPDATE should suffice,
-- as parents will be managing their children's profiles (including the PIN).
-- If children were to update their own PINs directly, specific policies would be needed.