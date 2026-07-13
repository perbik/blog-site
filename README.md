# echo

A full-stack personal blog built with Next.js, Neon Postgres, Drizzle ORM, Server Actions, Zod, Tailwind CSS, and Markdown.

## Local setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env.local` and set:

   ```env
   DATABASE_URL=your-neon-connection-string
   ADMIN_PASSWORD=your-private-admin-password
   ```

3. Apply committed migrations:

   ```bash
   pnpm db:migrate
   ```

4. Seed posts and approved sample comments:

   ```bash
   pnpm db:seed
   ```

5. Start the app:

   ```bash
   pnpm dev
   ```

Open `http://localhost:3000`. The admin dashboard is at `/admin`.

## Database workflow

After editing `lib/db/schema.ts`, generate and apply a committed SQL migration:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

Do not use `drizzle-kit push` as a replacement for migration files.

## Admin and moderation

Admin authentication uses the configured `ADMIN_PASSWORD`. A successful login creates an eight-hour, HTTP-only signed cookie, and every admin mutation validates that cookie on the server. Changing the password invalidates existing sessions. No user or session records are stored in the database.

New comments are saved with `approved = false`. They appear publicly only after approval from the moderation tab.

## Markdown posts

Post bodies accept Markdown, including headings, lists, links, blockquotes, code, tables, and GitHub-flavored Markdown. Raw HTML is not enabled.

## Verification

```bash
pnpm check
pnpm tsc --noEmit
pnpm build
```
