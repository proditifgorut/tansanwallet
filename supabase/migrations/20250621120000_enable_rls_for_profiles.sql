/*
# [SECURITY] Enable RLS and Define Policies for `profiles` table
This migration script enables Row Level Security (RLS) on the `public.profiles` table and sets up the necessary policies to secure user data.

## Query Description: This operation is a critical security enhancement. It ensures that users can only access and modify their own data, preventing unauthorized access to other users' profiles. It directly addresses the "RLS Disabled in Public" security advisory. No data will be lost, but access patterns will be restricted according to the new policies.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "High"
- Requires-Backup: false
- Reversible: true (by disabling RLS or altering policies)

## Structure Details:
- Table: `public.profiles`
- Changes:
  - Enables Row Level Security (RLS).
  - Adds policies for SELECT, INSERT, UPDATE, and DELETE operations.

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Policies are based on `auth.uid()`, requiring users to be authenticated for most operations.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: A minor performance overhead will be introduced for all queries on the `profiles` table due to RLS policy checks. This is a necessary trade-off for data security.
*/

-- 1. Enable RLS on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create SELECT policy
-- Allows authenticated users to view any profile.
DROP POLICY IF EXISTS "Authenticated users can view profiles." ON public.profiles;
CREATE POLICY "Authenticated users can view profiles."
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- 3. Create INSERT policy
-- Allows a user to insert their own profile. The trigger is the primary mechanism, but this provides an explicit security layer.
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. Create UPDATE policy
-- Allows a user to update only their own profile.
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Create DELETE policy
-- Disallows users from deleting profiles directly via the API for safety.
DROP POLICY IF EXISTS "Users cannot delete their own profile." ON public.profiles;
CREATE POLICY "Users cannot delete their own profile."
  ON public.profiles FOR DELETE
  USING (false);
