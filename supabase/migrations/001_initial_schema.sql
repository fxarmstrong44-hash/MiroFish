-- Vaultr Database Schema
-- All tables with RLS enabled

-- Enums
CREATE TYPE subscription_tier AS ENUM ('free', 'starter', 'pro', 'elite', 'secret');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');
CREATE TYPE payment_provider AS ENUM ('stripe', 'stitch');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE position_status AS ENUM ('open', 'closed');
CREATE TYPE trade_side AS ENUM ('buy', 'sell');
CREATE TYPE council_vote AS ENUM ('buy', 'sell', 'hold');
CREATE TYPE council_status AS ENUM ('pending', 'approved', 'executed', 'rejected');
CREATE TYPE alert_type AS ENUM ('price', 'opportunity', 'news', 'trade');
CREATE TYPE doc_type AS ENUM ('contract', 'tax', 'legal', 'other');
CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE asset_type AS ENUM ('stock', 'crypto', 'forex', 'commodity', 'etf');

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  country TEXT DEFAULT 'ZA',
  experience_level TEXT DEFAULT 'beginner',
  risk_tolerance NUMERIC DEFAULT 1.0 CHECK (risk_tolerance >= 0 AND risk_tolerance <= 5),
  strategy_preference TEXT,
  capital_range TEXT,
  vaultr_wealth_index NUMERIC DEFAULT 0,
  tier subscription_tier DEFAULT 'free',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tier subscription_tier DEFAULT 'free' NOT NULL,
  status subscription_status DEFAULT 'active' NOT NULL,
  stripe_subscription_id TEXT,
  stitch_payment_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  provider payment_provider NOT NULL,
  provider_payment_id TEXT,
  status payment_status DEFAULT 'pending' NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue Analytics
CREATE TABLE revenue_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name TEXT NOT NULL,
  tier subscription_tier,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolios
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT DEFAULT 'My Portfolio' NOT NULL,
  is_simulated BOOLEAN DEFAULT TRUE NOT NULL,
  virtual_balance NUMERIC DEFAULT 100000,
  initial_balance NUMERIC DEFAULT 100000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Positions
CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  asset_type asset_type DEFAULT 'stock' NOT NULL,
  quantity NUMERIC NOT NULL,
  entry_price NUMERIC NOT NULL,
  current_price NUMERIC,
  stop_loss NUMERIC,
  take_profit NUMERIC,
  status position_status DEFAULT 'open' NOT NULL,
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  pnl NUMERIC DEFAULT 0
);

-- Council Decisions
CREATE TABLE council_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  asset_type asset_type DEFAULT 'stock',
  direction TEXT,
  brain_votes JSONB DEFAULT '[]',
  consensus_score NUMERIC DEFAULT 0,
  confidence NUMERIC DEFAULT 0,
  risk_pct NUMERIC DEFAULT 0,
  explanation TEXT,
  probability_win NUMERIC,
  probability_loss NUMERIC,
  status council_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brain Analyses
CREATE TABLE brain_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES council_decisions(id) ON DELETE CASCADE NOT NULL,
  brain_name TEXT NOT NULL,
  vote council_vote NOT NULL,
  confidence NUMERIC DEFAULT 0,
  weight NUMERIC DEFAULT 1.0,
  reasoning TEXT,
  model_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trades
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  position_id UUID REFERENCES positions(id) ON DELETE SET NULL,
  side trade_side NOT NULL,
  symbol TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  fee NUMERIC DEFAULT 0,
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  is_simulated BOOLEAN DEFAULT TRUE,
  council_decision_id UUID REFERENCES council_decisions(id) ON DELETE SET NULL
);

-- Watchlist
CREATE TABLE watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  asset_type asset_type DEFAULT 'stock',
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

-- Alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type alert_type NOT NULL,
  symbol TEXT,
  condition JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals (Marketplace)
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  min_capital NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Network Connections
CREATE TABLE network_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  connected_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status connection_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (user_id <> connected_user_id)
);

-- Vault Documents
CREATE TABLE vault_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT,
  doc_type doc_type DEFAULT 'other' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax Records
CREATE TABLE tax_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  country TEXT DEFAULT 'ZA',
  total_gains NUMERIC DEFAULT 0,
  total_losses NUMERIC DEFAULT 0,
  tax_owed NUMERIC DEFAULT 0,
  optimization_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Strategies
CREATE TABLE user_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT FALSE,
  performance_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Behavior Logs
CREATE TABLE behavior_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discipline Scores
CREATE TABLE discipline_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score NUMERIC DEFAULT 50,
  factors JSONB DEFAULT '{}',
  period TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE council_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE discipline_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own portfolios" ON portfolios FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own positions" ON positions FOR ALL USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage own trades" ON trades FOR ALL USING (portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()));
CREATE POLICY "Users can manage own watchlist" ON watchlist FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own council decisions" ON council_decisions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own brain analyses" ON brain_analyses FOR SELECT USING (decision_id IN (SELECT id FROM council_decisions WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own alerts" ON alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active deals" ON deals FOR SELECT USING (status = 'active');
CREATE POLICY "Users can manage own deals" ON deals FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Users can view own connections" ON network_connections FOR ALL USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "Users can manage own vault" ON vault_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own tax records" ON tax_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own strategies" ON user_strategies FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own behavior logs" ON behavior_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own discipline scores" ON discipline_scores FOR ALL USING (auth.uid() = user_id);

-- Revenue analytics: service role only (no user policy needed)

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  INSERT INTO portfolios (user_id, name, is_simulated, virtual_balance, initial_balance)
  VALUES (NEW.id, 'Paper Trading', TRUE, 100000, 100000);
  INSERT INTO subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- User Memory (Claude AI persistent context)
CREATE TABLE user_memory (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('preference', 'analysis', 'trade', 'insight', 'context')),
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  importance INTEGER DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

ALTER TABLE user_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own memory" ON user_memory FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_memory_user_id ON user_memory(user_id);
CREATE INDEX idx_memory_type ON user_memory(type);
CREATE INDEX idx_memory_expires ON user_memory(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_positions_portfolio_id ON positions(portfolio_id);
CREATE INDEX idx_positions_status ON positions(status);
CREATE INDEX idx_trades_portfolio_id ON trades(portfolio_id);
CREATE INDEX idx_council_decisions_user_id ON council_decisions(user_id);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_revenue_analytics_feature ON revenue_analytics(feature_name);
