# Dev Log - 2025-06-08: Child User Creation Fix

**Objective:** Resolve issues preventing the successful creation of child users via the `create-child-user` Supabase Edge Function.

**Summary of Session:**

Today's session focused on diagnosing and fixing the `create-child-user` Supabase Edge Function. We successfully resolved two primary issues: environment variable loading and conflicts with an automatic profile creation trigger.

**Initial Problem 1: Environment Variables Not Set**

*   **Symptom:** The `create-child-user` Edge Function was failing with an error indicating `SUPABASE_URL` or `MY_SERVICE_ROLE_KEY` were not set in its environment.
*   **Diagnostics:**
    *   Confirmed `supabase/.env.local` contained `SUPABASE_URL=http://kong:8000` and the custom `MY_SERVICE_ROLE_KEY`.
    *   Ensured Supabase services were restarted (`supabase stop` then `supabase start`) after `supabase/.env.local` was in place.
    *   Added logging to the Edge Function (`Deno.env.toObject()`) to inspect all available environment variables at runtime.
*   **Discovery:** The Supabase Edge Runtime automatically injects standard environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and importantly, `SUPABASE_SERVICE_ROLE_KEY`. It was not picking up the custom `MY_SERVICE_ROLE_KEY` name directly from `.env.local` for the service role.
*   **Fix:** Modified `create-child-user/index.ts` to read `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')` instead of `Deno.env.get('MY_SERVICE_ROLE_KEY')`.

**Problem 2: Profile Already Exists for New Auth User ID**

*   **Symptom:** After fixing the environment variables, the Edge Function's pre-insert check (added in a previous session) started failing. It reported that a profile with the newly created auth user's ID already existed in the `public.profiles` table. This occurred consistently even with brand new, unique child user details.
*   **Diagnostics:**
    *   Hypothesized that an automatic process, likely a database trigger, was creating the profile immediately after the auth user was created.
    *   Queried `pg_trigger` to list triggers on `auth.users`.
*   **Discovery:** An `AFTER INSERT` trigger named `on_auth_user_created` was found on the `auth.users` table. This trigger executes a function named `handle_new_user`.
    *   Queried `pg_proc` (using `prosrc`) to inspect the source code of the `handle_new_user` function.
    *   Confirmed `handle_new_user` automatically `INSERT`s a new row into `public.profiles` using the `NEW.id` (the new auth user's ID) and attempts to populate `full_name` and `username` from `NEW.raw_user_meta_data`.
*   **Fix:**
    *   Refactored the `create-child-user/index.ts` Edge Function:
        1.  Removed the "pre-insert check" logic, as the profile is now expected to exist.
        2.  Changed the profile creation step from an `INSERT` operation to an `UPDATE` operation.
        3.  The `UPDATE` operation now targets the profile row matching the `childUserId` (created by the trigger) and populates it with `full_name`, `username`, `role: 'child'`, and `managed_by_user_id` provided in the Edge Function's request body.
*   **Outcome:** The `create-child-user` function now successfully creates an auth user, and then updates the automatically generated profile with the correct child-specific details. Child users can now be added to the system.

**Key Files Modified:**

*   `/Users/barryallen/Local Documents/Local Web Dev/messy-mind/supabase/functions/create-child-user/index.ts`
    *   Updated to use `SUPABASE_SERVICE_ROLE_KEY`.
    *   Logic changed from profile `INSERT` to `UPDATE`.
    *   Removed pre-insert profile existence check.

**Final Status:**

The child user creation flow is now working correctly. The Edge Function successfully communicates with Supabase, creates an auth user, and then correctly populates the associated profile for the child, linking it to the parent.
