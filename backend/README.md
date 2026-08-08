# MirrorTrade backend

NestJS API for ingesting trading signals, applying risk controls, and coordinating broker orders. The platform is designed around a safety boundary: ingesting a signal never submits a trade directly. Every order must first become an auditable trade intent and pass the risk engine.

## Current Day 1 foundation

- NestJS bootstrap with strict request validation, security headers, and a CORS allow-list
- PostgreSQL schema for users, broker accounts, signal sources, signals, trade intents, orders, payments, and audit logs
- Database-backed health endpoint at `GET /api/v1/health`
- A fail-closed risk engine that permits only active demo accounts into human review
- Email/password authentication and an authenticated trading-profile API, where every user chooses their own symbols and risk limits
- Encrypted Deriv MT5 demo-account onboarding; the account API never returns credential data
- Deterministic signal parsing that fails closed when required fields or price directions are invalid
- Docker Compose PostgreSQL service and production Dockerfile

## Local setup

1. Copy `.env.example` to `backend/.env` and supply safe, local-only values.
2. Install dependencies with `npm install`.
3. Start Postgres with `docker compose up postgres`.
4. Run `npm run start:dev`.

The API will listen on `http://localhost:3000`; use `http://localhost:3000/api/v1/health` to verify the service and database.

## Secrets

Never commit `.env` files, bot tokens, payment keys, or broker credentials. Broker credentials will be encrypted at rest before broker-account storage is implemented. Use demo broker accounts until the risk engine and approval workflow are complete.

## Roadmap

1. Encrypted demo broker-account onboarding
2. Telegram ingestion and deterministic signal parsing
3. Approval queue and broker adapter behind an execution feature flag
4. Flutterwave webhook verification and subscriptions
5. WebSocket events, monitoring, deployment, and end-to-end tests
