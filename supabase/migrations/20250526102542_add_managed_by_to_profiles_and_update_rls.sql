-- Add managed_by_user_id column to public.profiles table
ALTER TABLE public.profiles
ADD COLUMN managed_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Add a comment for the new column
COMMENT ON COLUMN public.profiles.managed_by_user_id IS 'Stores the user ID of the parent/guardian managing this profile, if it''s a child profile.';

-- Update RLS policies for the profiles table

-- Drop existing policies first to redefine them
-- (Make sure these names match your actual policy names from 20250525170854_create_profiles_table.sql)
DROP POLICY IF EXISTS "Allow individual user read access to their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual user update access to their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual user to insert their own profile" ON public.profiles;
-- If you have a DELETE policy, drop it here too. Example:
-- DROP POLICY IF EXISTS "Allow individual user to delete their own profile" ON public.profiles;


-- POLICY: Users can view their own profile OR profiles they manage.
CREATE POLICY "Profiles: Allow read access for own and managed profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id OR
    auth.uid() = managed_by_user_id
  );

-- POLICY: Users can insert their own profile OR profiles they will manage.
-- When inserting a child profile, the 'managed_by_user_id' must be set to the current user's id.
-- When inserting their own profile, 'id' must be their auth.uid() and 'managed_by_user_id' can be NULL or their own id.
CREATE POLICY "Profiles: Allow insert for own or managed profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (
    (auth.uid() = id AND (managed_by_user_id IS NULL OR managed_by_user_id = auth.uid())) OR
    (auth.uid() = managed_by_user_id)
  );

-- POLICY: Users can update their own profile OR profiles they manage.
CREATE POLICY "Profiles: Allow update for own and managed profiles"
  ON public.profiles FOR UPDATE
  USING (
    auth.uid() = id OR
    auth.uid() = managed_by_user_id
  )
  WITH CHECK (
    (auth.uid() = id AND (managed_by_user_id IS NULL OR managed_by_user_id = auth.uid())) OR
    (auth.uid() = managed_by_user_id)
  );

-- POLICY: Users can delete profiles they manage (children), but not their own primary profile through this.
-- To delete their own account, they should go through the auth.users deletion process, which cascades.
CREATE POLICY "Profiles: Allow delete for managed child profiles"
  ON public.profiles FOR DELETE
  USING (
    auth.uid() = managed_by_user_id AND
    id != auth.uid() -- Prevents deleting own profile via this policy
  );
