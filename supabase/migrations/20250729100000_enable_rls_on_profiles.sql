/*
          # [Enable RLS on Profiles Table]
          This script enables Row Level Security (RLS) on the public.profiles table and applies policies to protect user data. This is a critical security fix to prevent unauthorized data access.

          ## Query Description:
          This operation secures the `profiles` table. It ensures that users can only view and edit their own profile information. It prevents any user from seeing or modifying another user's data. This change does not delete or alter any existing data.

          ## Metadata:
          - Schema-Category: "Security"
          - Impact-Level: "High"
          - Requires-Backup: false
          - Reversible: true

          ## Structure Details:
          - Table: `public.profiles`
          - Policies Added:
            - "Enable read access for users on their own profile"
            - "Enable update for users on their own profile"
            - "Enable insert for users on their own profile"

          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes
          - Auth Requirements: All access to the `profiles` table will now require an authenticated user session.

          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Negligible. RLS checks are highly optimized in PostgreSQL.
*/

-- 1. Enable Row Level Security on the 'profiles' table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create policy for SELECT
-- This policy allows a user to view their own profile.
DROP POLICY IF EXISTS "Enable read access for users on their own profile" ON public.profiles;
CREATE POLICY "Enable read access for users on their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 3. Create policy for UPDATE
-- This policy allows a user to update their own profile.
DROP POLICY IF EXISTS "Enable update for users on their own profile" ON public.profiles;
CREATE POLICY "Enable update for users on their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Create policy for INSERT
-- This policy allows a user to insert their own profile record.
-- The trigger `on_auth_user_created` already handles this, but this policy provides an extra layer of security.
DROP POLICY IF EXISTS "Enable insert for users on their own profile" ON public.profiles;
CREATE POLICY "Enable insert for users on their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 5. Create policy for DELETE
-- By default, we will disallow users from deleting their own profiles for data integrity.
-- This can be changed later if needed.
DROP POLICY IF EXISTS "Disallow delete access" ON public.profiles;
CREATE POLICY "Disallow delete access"
ON public.profiles
FOR DELETE
USING (false);
