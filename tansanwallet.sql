-- =================================================================
-- TANSANWALLET - DEFINITIVE & IDEMPOTENT DATABASE SCHEMA
-- Version: 3.0
-- Description: This script resets and rebuilds the entire database
-- schema, fixing all previous errors and critically enabling
-- Row Level Security (RLS) on all user data tables.
-- =================================================================

-- STEP 1: Drop all existing objects in reverse order of dependency
-- This uses CASCADE to ensure a clean slate and prevent dependency errors.
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.portfolio_items CASCADE;
DROP TABLE IF EXISTS public.wallets CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.asset_types CASCADE;

-- Drop ENUM types if they exist to prevent conflicts
DROP TYPE IF EXISTS public.kyc_status;
DROP TYPE IF EXISTS public.risk_profile;
DROP TYPE IF EXISTS public.transaction_status;
DROP TYPE IF EXISTS public.transaction_type;
DROP TYPE IF EXISTS public.asset_category;

-- STEP 2: Re-create ENUM types
CREATE TYPE public.kyc_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE public.risk_profile AS ENUM ('conservative', 'moderate', 'aggressive');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE public.transaction_type AS ENUM ('topup', 'withdraw', 'transfer', 'payment', 'qris');
CREATE TYPE public.asset_category AS ENUM ('crypto', 'stock', 'forex', 'gold');

-- STEP 3: Create 'profiles' table for user data
-- This table is linked to the 'auth.users' table.
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    kyc_status public.kyc_status DEFAULT 'pending' NOT NULL,
    risk_profile public.risk_profile DEFAULT 'moderate' NOT NULL
);
COMMENT ON TABLE public.profiles IS 'Stores public-facing user profile information.';

-- STEP 4: Create 'wallets' table for user balances
CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.wallets IS 'Stores wallet balances for each user.';

-- STEP 5: Create 'transactions' table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    type public.transaction_type NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    status public.transaction_status DEFAULT 'pending' NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.transactions IS 'Records all financial transactions for users.';

-- STEP 6: Create 'asset_types' table
CREATE TABLE public.asset_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category public.asset_category NOT NULL
);
COMMENT ON TABLE public.asset_types IS 'Defines the types of investment assets available.';

-- STEP 7: Create 'portfolio_items' table
CREATE TABLE public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    asset_type_id INTEGER NOT NULL REFERENCES public.asset_types(id),
    symbol VARCHAR(20) NOT NULL,
    name TEXT,
    quantity NUMERIC(18, 8) NOT NULL,
    purchase_price NUMERIC(18, 8) NOT NULL,
    purchase_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.portfolio_items IS 'Stores individual investment assets held by users.';

-- STEP 8: Seed the 'asset_types' table
INSERT INTO public.asset_types (name, category) VALUES
    ('Bitcoin', 'crypto'),
    ('Ethereum', 'crypto'),
    ('Bank BRI', 'stock'),
    ('Telkom Indonesia', 'stock'),
    ('USD/IDR', 'forex'),
    ('Gold', 'gold')
ON CONFLICT (name) DO NOTHING;

-- STEP 9: Create function to handle new user creation
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a profile for the new user
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  -- Create a default IDR wallet for the new user
  INSERT INTO public.wallets (user_id, currency, balance)
  VALUES (NEW.id, 'IDR', 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile and wallet for new authenticated users.';

-- STEP 10: Create trigger to call the function on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =================================================================
-- CRITICAL SECURITY STEP: Enable Row Level Security (RLS)
-- and define policies for all tables.
-- =================================================================

-- Profiles Table Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Wallets Table Policies
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own wallets." ON public.wallets FOR ALL USING (auth.uid() = user_id);

-- Transactions Table Policies
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own transactions." ON public.transactions FOR ALL USING (auth.uid() = user_id);

-- Portfolio Items Table Policies
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own portfolio items." ON public.portfolio_items FOR ALL USING (auth.uid() = user_id);

-- Asset Types Table Policy (Publicly readable)
ALTER TABLE public.asset_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Asset types are publicly viewable." ON public.asset_types FOR SELECT USING (true);
