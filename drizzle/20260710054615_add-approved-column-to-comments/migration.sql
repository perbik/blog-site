ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "approved" boolean DEFAULT false NOT NULL;
