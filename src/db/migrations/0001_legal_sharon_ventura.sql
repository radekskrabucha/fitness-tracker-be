CREATE TYPE "public"."activity_level" AS ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active');--> statement-breakpoint
CREATE TYPE "public"."dietary_preference" AS ENUM('no_preference', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo', 'mediterranean');--> statement-breakpoint
CREATE TYPE "public"."fitness_goal" AS ENUM('lose_weight', 'gain_muscle', 'maintain_weight', 'improve_endurance', 'increase_flexibility');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other', 'prefer_not_to_say');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_fitness_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"height" integer NOT NULL,
	"weight" integer NOT NULL,
	"age" integer NOT NULL,
	"gender" "gender" NOT NULL,
	"activity_level" "activity_level" NOT NULL,
	"fitness_goal" "fitness_goal" NOT NULL,
	"dietary_preference" "dietary_preference",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_fitness_profiles" ADD CONSTRAINT "user_fitness_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
