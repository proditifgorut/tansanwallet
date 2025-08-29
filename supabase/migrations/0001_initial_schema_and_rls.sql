/*
# [TansanWallet] - Full Idempotent Database Schema &amp; Security Setup
This script initializes and secures the entire database schema for the TansanWallet application.
It is designed to be idempotent, meaning it can be run multiple times without causing errors.
It creates the user profiles table, sets up an automatic profile creation trigger,
and most importantly, enables and configures Row Level Security (RLS) to fix the critical
`RLS Disabled in Public` security vulnerability.

## Query Description:
This operation will:
1.  Safely drop existing policies, triggers, and functions to prevent conflicts.
2.  Create the `public.profiles` table if it doesn't exist.
3.  Create a function and trigger to automatically populate the `profiles` table when a new user signs up in Supabase Auth.
4.  Enable Row Level Security on the `profiles` table.
5.  Create strict security policies ensuring users can only view and update their own data.
This script is safe to run on an existing database with the same structure, as it uses `IF EXISTS` checks.

## Metadata:
- Schema-Category: ["Structural", "Security"]
- Impact-Level: ["High"]
- Requires-Backup: false
- Reversible: false

## Structure Details:
- Tables Affected: `public.profiles`
- Functions Affected: `public.handle_new_user`
- Triggers Affected: `on_auth_user_created` on `auth.users`

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes. This script's primary purpose is to add RLS policies to the `profiles` table, fixing a critical vulnerability.
- Auth Requirements: Policies are based on `auth.uid()`.

## Performance Impact:
- Indexes: A primary key index is created on `profiles.id`.
- Triggers: An `AFTER INSERT` trigger is added to `auth.users`. Impact is minimal, only occurring on user creation.
- Estimated Impact: Low. RLS adds a minor overhead to queries, but it is essential for security.
*/

-- Step 1: Clean up existing objects to ensure idempotency.
-- Drop policies first, as they depend on the table.
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;

-- Drop the trigger from the auth.users table.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function that the trigger calls.
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Create the `profiles` table.
-- This table stores public data associated with each user.
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY,
  updated_at timestamp with time zone,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  website text,
  CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT username_length CHECK (char_length(username) &gt;= 3)
);
COMMENT ON TABLE public.profiles IS 'Public profile information for each user.';

-- Step 3: Create the function to handle new user creation.
-- This function inserts a new row into public.profiles for each new user.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data-&gt;&gt;'full_name', new.raw_user_meta_data-&gt;&gt;'avatar_url');
  RETURN new;
END;
$$;
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates a public profile for a new user.';

-- Step 4: Create the trigger on the auth.users table.
-- This trigger calls handle_new_user() after a new user is inserted.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'When a new user signs up, create a profile for them.';

-- Step 5: Enable Row Level Security (RLS) on the profiles table.
-- This is the CRITICAL step to secure user data.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.profiles IS 'Public profile information for each user. RLS is enabled.';

-- Step 6: Create RLS policies for the profiles table.
-- These policies define who can access which rows.

-- Policy for SELECT: Allows users to read their own profile data.
CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

-- Policy for UPDATE: Allows users to update their own profile data.
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Step 7: Grant permissions to roles.
-- While Supabase UI does this, being explicit in scripts is good practice.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;
