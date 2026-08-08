CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TYPE user_role AS ENUM ('user', 'admin', 'support');
CREATE TYPE account_status AS ENUM ('pending', 'active', 'paused', 'revoked');
CREATE TYPE signal_status AS ENUM ('received', 'parsed', 'rejected', 'approved', 'expired');
CREATE TYPE trade_status AS ENUM ('pending', 'submitted', 'filled', 'partially_filled', 'rejected', 'cancelled', 'failed');
CREATE TYPE payment_status AS ENUM ('pending', 'successful', 'failed', 'refunded');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE trading_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  copy_trading_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  kill_switch_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  max_risk_per_trade NUMERIC(6, 3) NOT NULL DEFAULT 1.000 CHECK (max_risk_per_trade > 0 AND max_risk_per_trade <= 100),
  max_daily_loss NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (max_daily_loss >= 0),
  max_open_positions INTEGER NOT NULL DEFAULT 3 CHECK (max_open_positions BETWEEN 1 AND 100),
  allowed_symbols TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE broker_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  broker TEXT NOT NULL,
  account_reference TEXT NOT NULL,
  credentials_ciphertext BYTEA NOT NULL,
  credentials_key_version SMALLINT NOT NULL DEFAULT 1,
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  status account_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (broker, account_reference)
);

CREATE TABLE signal_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL DEFAULT 'telegram',
  external_chat_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  is_trusted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (platform, external_chat_id)
);

CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES signal_sources(id),
  external_message_id TEXT NOT NULL,
  raw_message TEXT NOT NULL,
  parsed_payload JSONB,
  parse_confidence NUMERIC(4, 3),
  status signal_status NOT NULL DEFAULT 'received',
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  UNIQUE (source_id, external_message_id)
);

CREATE TABLE trade_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID NOT NULL REFERENCES signals(id),
  broker_account_id UUID NOT NULL REFERENCES broker_accounts(id),
  idempotency_key UUID NOT NULL UNIQUE,
  requested_order JSONB NOT NULL,
  risk_decision JSONB NOT NULL,
  status trade_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE broker_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_intent_id UUID NOT NULL UNIQUE REFERENCES trade_intents(id),
  broker_order_id TEXT,
  status trade_status NOT NULL DEFAULT 'pending',
  request_payload JSONB NOT NULL,
  response_payload JSONB,
  submitted_at TIMESTAMPTZ,
  filled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  provider TEXT NOT NULL DEFAULT 'flutterwave',
  provider_reference TEXT NOT NULL UNIQUE,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  currency CHAR(3) NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  provider_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX signals_status_received_idx ON signals (status, received_at DESC);
CREATE INDEX trade_intents_account_status_idx ON trade_intents (broker_account_id, status);
CREATE INDEX audit_logs_entity_idx ON audit_logs (entity_type, entity_id, created_at DESC);
