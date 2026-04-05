# Premium Homepage Concepting MVP

Internal prototype for an AI-assisted premium website concepting app focused on service-business homepages.

## Architecture

- `app/`: Next.js App Router pages for landing, auth, dashboard, project creation, and workspace.
- `components/`: Reusable UI for auth, forms, dashboard cards, workspace panels, and homepage preview rendering.
- `lib/types.ts`: Shared domain types for projects, versions, style presets, and structured generation output.
- `lib/generation/pipeline.ts`: Mocked generation pipeline with a typed JSON result shape aligned to future model integration.
- `lib/mock-data/storage.ts`: Local persistence and demo auth flow used by the MVP to stay runnable without backend wiring.
- `lib/supabase/`: Client boundary for future real auth/database integration.
- `supabase/`: SQL schema and seed data for `users`, `projects`, `versions`, and `style_presets`.

## What is production-ready vs mocked

- Production-minded:
  - Next.js App Router structure
  - Typed domain model and generation schema
  - Reusable workspace architecture
  - Supabase schema, RLS policies, and seed data
  - Clear separation between UI, generation logic, and persistence boundary

- Mocked for the prototype:
  - Auth uses local storage instead of live Supabase auth
  - Data persistence uses local storage instead of Supabase tables
  - AI generation uses a deterministic typed mock pipeline instead of real model calls
  - Export output is generated from structured JSON rather than external file/download services

## Suggested next production steps

1. Replace local auth and storage with Supabase auth + row-backed repositories.
2. Move generation to a server action or route handler that calls a real model.
3. Add protected routing and session hydration.
4. Persist export artifacts and add copy/download actions.
