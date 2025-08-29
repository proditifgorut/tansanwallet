/*
# [CRITICAL SECURITY FIX] Enable and Configure Row Level Security (RLS)

This script enables Row Level Security (RLS) on all application tables and applies strict access policies.
This is a critical step to resolve the "[ERROR] RLS Disabled in Public" security advisory.

## Query Description:
This operation secures your data by ensuring users can only access their own information. It enables RLS on the `profiles`, `wallets`, `transactions`, and `portfolio_items` tables and creates policies for SELECT, INSERT, UPDATE, and DELETE operations. There is no risk of data loss.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "High"
- Requires-Backup: false
- Reversible: true (by disabling RLS)

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Policies are based on `auth.uid()`
*/

-- Step 1: Enable RLS on all relevant tables
-- This command is idempotent and will not cause an error if RLS is already enabled.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Step 2: Define RLS Policies for 'profiles' table
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Step 3: Define RLS Policies for 'wallets' table
DROP POLICY IF EXISTS "Users can view their own wallets." ON public.wallets;
CREATE POLICY "Users can view their own wallets." ON public.wallets FOR SELECT USING (auth.uid() = user_id);
-- Note: Wallet creation is handled by a trigger. Balance updates should be handled by secure functions, not direct user updates.

-- Step 4: Define RLS Policies for 'transactions' table
DROP POLICY IF EXISTS "Users can view their own transactions." ON public.transactions;
CREATE POLICY "Users can view their own transactions." ON public.transactions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own transactions." ON public.transactions;
CREATE POLICY "Users can create their own transactions." ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Note: Transactions are immutable; updates and deletes are intentionally not allowed.

-- Step 5: Define RLS Policies for 'portfolio_items' table
DROP POLICY IF EXISTS "Users can manage their own portfolio." ON public.portfolio_items;
CREATE POLICY "Users can manage their own portfolio." ON public.portfolio_items FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
