-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/xcfwdwmqrdtchnckutoc/sql/new

-- 1. Add new columns to existing tables
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "password_hash" VARCHAR(200);

ALTER TABLE "review" ADD COLUMN IF NOT EXISTS "reply" TEXT;
ALTER TABLE "review" ADD COLUMN IF NOT EXISTS "replied_at" TIMESTAMPTZ;

ALTER TABLE "contact_request" ADD COLUMN IF NOT EXISTS "contact_info_revealed" BOOLEAN NOT NULL DEFAULT false;

-- 2. Create provider_account table
CREATE TABLE IF NOT EXISTS "provider_account" (
  "id" SERIAL PRIMARY KEY,
  "phone" VARCHAR(20) NOT NULL UNIQUE,
  "password_hash" VARCHAR(200) NOT NULL,
  "provider_id" INTEGER NOT NULL UNIQUE,
  "last_login_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "provider_account_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE
);

-- 3. Create conversation table
CREATE TABLE IF NOT EXISTS "conversation" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "provider_id" INTEGER NOT NULL,
  "last_message" VARCHAR(500),
  "last_message_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "conversation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE,
  CONSTRAINT "conversation_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_provider"("id") ON DELETE CASCADE,
  UNIQUE ("user_id", "provider_id")
);

CREATE INDEX IF NOT EXISTS "conversation_user_id_last_message_at_idx" ON "conversation" ("user_id", "last_message_at" DESC);
CREATE INDEX IF NOT EXISTS "conversation_provider_id_last_message_at_idx" ON "conversation" ("provider_id", "last_message_at" DESC);

-- 4. Create message table
CREATE TABLE IF NOT EXISTS "message" (
  "id" SERIAL PRIMARY KEY,
  "conversation_id" INTEGER NOT NULL,
  "sender_id" INTEGER NOT NULL,
  "sender_type" VARCHAR(10) NOT NULL,
  "content" TEXT NOT NULL,
  "is_read" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "message_conversation_id_created_at_idx" ON "message" ("conversation_id", "created_at");
