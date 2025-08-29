-- =================================================================
-- TANSANWALLET - FINAL & DEFINITIVE DATABASE SCHEMA
-- This script is idempotent and will reset the entire public schema.
-- It enables Row Level Security on all user data tables.
-- =================================================================

-- STEP 1: Drop existing objects in the correct order to avoid dependency errors.
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.portfolio_items CASCADE;
DROP TABLE IF EXISTS public.wallets CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.asset_types CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop existing enums if they exist
DROP TYPE IF EXISTS public.kyc_status;
DROP TYPE IF EXISTS public.risk_profile;
DROP TYPE IF EXISTS public.asset_category;
DROP TYPE IF EXISTS public.transaction_type;
DROP TYPE IF EXISTS public.transaction_status;

-- STEP 2: Create custom ENUM types for consistency.
CREATE TYPE public.kyc_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE public.risk_profile AS ENUM ('conservative', 'moderate', 'aggressive');
CREATE TYPE public.asset_category AS ENUM ('crypto', 'stock', 'forex', 'gold');
CREATE TYPE public.transaction_type AS ENUM ('topup', 'withdraw', 'transfer', 'payment', 'qris');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed');

-- STEP 3: Create the asset_types table.
CREATE TABLE public.asset_types (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category public.asset_category NOT NULL
);

-- STEP 4: Create the profiles table.
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    kyc_status public.kyc_status DEFAULT 'pending' NOT NULL,
    risk_profile public.risk_profile DEFAULT 'moderate' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- STEP 5: Create the wallets table.
CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    currency TEXT NOT NULL DEFAULT 'IDR',
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, currency)
);

-- STEP 6: Create the transactions table.
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    type public.transaction_type NOT NULL,
    status public.transaction_status NOT NULL DEFAULT 'pending',
    amount NUMERIC(15, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- STEP 7: Create the portfolio_items table.
CREATE TABLE public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    asset_type_id INTEGER NOT NULL REFERENCES public.asset_types(id),
    symbol TEXT NOT NULL,
    name TEXT,
    quantity NUMERIC(20, 8) NOT NULL,
    purchase_price NUMERIC(20, 8) NOT NULL,
    purchase_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- STEP 8: Create the function to handle new user creation.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.wallets (user_id, currency, balance)
  VALUES (NEW.id, 'IDR', 2750000); -- Default starting balance for new users
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 9: Create the trigger to call the function.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =================================================================
-- CRITICAL SECURITY STEP: Enable Row Level Security (RLS)
-- =================================================================

-- STEP 10: Enable RLS on all tables with user data.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- STEP 11: Create RLS policies for the 'profiles' table.
CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- STEP 12: Create RLS policies for the 'wallets' table.
CREATE POLICY "Users can view their own wallets."
  ON public.wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallets."
  ON public.wallets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- STEP 13: Create RLS policies for the 'transactions' table.
CREATE POLICY "Users can view their own transactions."
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own transactions."
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- STEP 14: Create RLS policies for the 'portfolio_items' table.
CREATE POLICY "Users can view their own portfolio."
  ON public.portfolio_items FOR SELECT
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can manage their own portfolio."
  ON public.portfolio_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- STEP 15: Populate the asset_types table with initial data.
INSERT INTO public.asset_types (name, category) VALUES
('Bitcoin', 'crypto'),
('Ethereum', 'crypto'),
('Bank BRI (BBRI)', 'stock'),
('Telkom Indonesia (TLKM)', 'stock'),
('USD/IDR', 'forex'),
('Gold', 'gold')
ON CONFLICT (name) DO NOTHING;
