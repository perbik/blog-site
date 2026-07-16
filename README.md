# echo

`echo` is a full-stack personal blog built with Next.js 16, React 19, Neon Postgres, Drizzle ORM, Better Auth, Vercel Blob, Server Actions, Zod, Tailwind CSS, and Markdown

The public site includes a hero carousel, searchable and tag-filtered blog listings, Markdown post pages, and moderated comments. The protected admin dashboard supports post creation and editing, image uploads, soft deletion and restoration, bulk actions, permanent deletion, and comment approval settings

## Requirements

- Node.js 20 or later
- pnpm
- A Neon Postgres database
- A Vercel Blob store if cover-image uploads are needed locally

## Local setup

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env.local`

   ```bash
   cp .env.example .env.local
   ```

3. Configure the environment variables in `.env.local`

   ```env
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   BETTER_AUTH_SECRET=replace-with-a-generated-secret
   BETTER_AUTH_URL=http://localhost:3000
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=replace-with-a-strong-private-password
   ```

   `ADMIN_PASSWORD` is used by the one-time admin bootstrap command. Runtime login and sessions are managed by Better Auth

4. Apply the committed database migrations

   ```bash
   pnpm db:migrate
   ```

5. Seed sample content if needed

   ```bash
   pnpm db:seed
   ```

6. Create the configured admin account

   ```bash
   pnpm auth:bootstrap
   ```

   The bootstrap command is safe to rerun when the admin already exists

7. Start the development server

   ```bash
   pnpm dev
   ```

Open `http://localhost:3000`. The admin dashboard is available at `http://localhost:3000/admin`

## Database migrations

The Drizzle schema is defined in:

- `lib/db/schema.ts` for posts, comments, and comment settings
- `lib/db/auth-schema.ts` for Better Auth users, accounts, and sessions

After changing either schema, generate a named migration and review its SQL before applying it

```bash
pnpm db:generate --name=describe-the-change
pnpm db:migrate
```

Committed migration folders in `drizzle/` are the database's chronological history and should not be deleted after deployment

To inspect the configured database with Drizzle Studio:

```bash
pnpm db:studio
```

## Seeding

Seed all sample posts and comments:

```bash
pnpm db:seed
```

Seed only posts:

```bash
pnpm db:seed:posts
```

Seed only comments:

```bash
pnpm db:seed:comments
```

Run migrations before seeding because the seed scripts require the application tables to exist. Direct seeding bypasses the deployed application's cache invalidation, so a deployed site may need an in-app post update or a new deployment before cached lists reflect seeded data

## Verification

```bash
pnpm check
pnpm exec tsc --noEmit
pnpm build
```
