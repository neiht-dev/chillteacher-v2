CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."membership" AS ENUM('free', 'premium', 'trial');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('guest', 'user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'pending', 'suspended');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"display_name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"password_hash" varchar(256) NOT NULL,
	"status" "status" DEFAULT 'active',
	"role" "roles" DEFAULT 'guest',
	"avatar_url" varchar(512),
	"last_login" timestamp with time zone,
	"membership" "membership" DEFAULT 'free',
	"gender" "gender" DEFAULT 'other',
	"date_of_birth" date,
	"phone" varchar(32),
	"bio" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");