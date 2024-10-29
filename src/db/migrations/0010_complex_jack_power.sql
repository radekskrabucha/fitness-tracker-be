CREATE TYPE "public"."exercise_attribute_name" AS ENUM('sets', 'reps', 'weight', 'duration', 'distance');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_workout_exercise_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"workout_exercise_id" uuid NOT NULL,
	"attribute_name" "exercise_attribute_name" NOT NULL,
	"value" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_workout_exercise_attributes" ADD CONSTRAINT "user_workout_exercise_attributes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_workout_exercise_attributes" ADD CONSTRAINT "user_workout_exercise_attributes_workout_exercise_id_workout_exercises_id_fk" FOREIGN KEY ("workout_exercise_id") REFERENCES "public"."workout_exercises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
