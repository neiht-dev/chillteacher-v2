CREATE TYPE "public"."class_status" AS ENUM('active', 'inactive', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."enrollment_status" AS ENUM('pending', 'approved', 'rejected', 'cancelled');--> statement-breakpoint
CREATE TABLE "classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"teacher_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"room" varchar(100),
	"capacity" integer DEFAULT 30 NOT NULL,
	"enrolled" integer DEFAULT 0 NOT NULL,
	"status" "class_status" DEFAULT 'active',
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"schedule" text,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"updated" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"code" varchar(50) NOT NULL,
	"credits" integer DEFAULT 3 NOT NULL,
	"duration" integer DEFAULT 60 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"updated" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"status" "enrollment_status" DEFAULT 'pending',
	"enrolled_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" text,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"updated" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX "course_code_idx" ON "courses" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "student_class_idx" ON "enrollments" USING btree ("student_id","class_id");