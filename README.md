# Side Stories

Side Stories is a public archive for physical artifacts that travel from one
person to another. Each artifact carries a quest; each keeper can immediately
publish a chapter about where it went and what happened.

## Stack

- Next.js 16 App Router and React 19
- Tailwind CSS 4
- Supabase Postgres and Row Level Security
- Zod validation
- Vitest unit tests and Playwright browser smoke tests

## Local setup

Requirements:

- Node.js 20.9 or newer
- A Supabase project

Install dependencies and create local environment settings:

```bash
npm install
cp .env.example .env.local
```

Fill every required value in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public anonymous key used for read-only
  queries.
- `NEXT_PUBLIC_SITE_URL`: canonical deployed URL, or
  `http://localhost:3000` locally.
- `SUPABASE_SERVICE_ROLE_KEY`: private server-only key used by the guarded
  chapter action.
- `SUBMISSION_HASH_SECRET`: at least 32 random characters used to HMAC client
  IP addresses for rate limiting.

Never expose the service-role key or hash secret through a `NEXT_PUBLIC_`
variable.

## Database migration

Apply
[`supabase/migrations/202606240001_harden_side_stories.sql`](supabase/migrations/202606240001_harden_side_stories.sql)
through the Supabase SQL editor or your normal Supabase CLI migration workflow.

The migration is idempotent and:

- preserves existing artifact and story rows;
- seeds or updates the seven canonical artifacts;
- adds artifact ordering and relic titles;
- enables public read-only RLS policies;
- removes anonymous mutation privileges;
- creates a private rate-limit table;
- installs the service-role-only `submit_story` function.

After schema changes, refresh the committed TypeScript definitions:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID \
  > lib/supabase/database.types.ts
```

Review generated changes before committing; the application deliberately
selects only public fields.

## Development and checks

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

Run the complete non-browser verification suite with:

```bash
npm run check
```

Browser smoke tests require a configured Supabase environment:

```bash
npm run test:e2e
```

The valid-submission browser test is skipped by default because it creates a
real public story. Set `E2E_ALLOW_WRITES=true` and `E2E_ARTIFACT_ID` only
against a project where that mutation is acceptable.

## Security model

- Browser-visible Supabase credentials can only read `artifacts` and
  `stories`.
- Chapter writes execute in a Server Action using the service-role client.
- Every submission is validated server-side and checked against a real
  artifact.
- A hidden honeypot rejects basic bots.
- Raw IP addresses are never stored. The server creates an HMAC fingerprint,
  and the database accepts at most three successful submissions per
  fingerprint in a rolling 15-minute window.
- Rate limiting and insertion occur in one database transaction, so failed
  inserts do not consume quota and concurrent submissions cannot bypass it.
- React renders story content as escaped plain text; no submitted HTML is
  interpreted.
- Instagram usernames are optional and, when supplied, are intentionally
  published with the chapter.

Inappropriate chapters are removed through the Supabase dashboard. This
version does not include accounts, CAPTCHA, reporting, or an in-app moderation
interface.

## Deployment

Deploy to any Next.js-compatible Node host. Configure all five environment
variables listed above, apply the migration before sending traffic, and run
`npm run check` in CI.

The production build has no font-download dependency. CI is defined in
`.github/workflows/ci.yml` and verifies linting, TypeScript, unit tests, and the
production build on every pull request and push to `main`.
