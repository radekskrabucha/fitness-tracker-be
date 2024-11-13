CREATE TABLE IF NOT EXISTS "user_workout_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"workout_id" uuid NOT NULL,
	"workout_plan_id" uuid NOT NULL,
	"attribute_name" "exercise_attribute_name" NOT NULL,
	"integer_value" integer,
	"description" varchar(256),
	"boolean_value" boolean,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "default_workout_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workout_id" uuid NOT NULL,
	"workout_plan_id" uuid NOT NULL,
	"attribute_name" "exercise_attribute_name" NOT NULL,
	"integer_value" integer,
	"description" varchar(256),
	"boolean_value" boolean,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_category_id_exercise_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "user_workout_exercise_attributes" DROP CONSTRAINT "user_workout_exercise_attributes_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_workout_exercise_attributes" DROP CONSTRAINT "user_workout_exercise_attributes_workout_exercise_id_workout_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "default_workout_exercise_attributes" DROP CONSTRAINT "default_workout_exercise_attributes_workout_exercise_id_workout_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "user_fitness_profiles" ADD COLUMN "date_of_birth" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "user_workout_exercise_attributes" ADD COLUMN "workout_plan_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "default_workout_exercise_attributes" ADD COLUMN "workout_plan_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_workout_attributes" ADD CONSTRAINT "user_workout_attributes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_workout_attributes" ADD CONSTRAINT "user_workout_attributes_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_workout_attributes" ADD CONSTRAINT "user_workout_attributes_workout_plan_id_workout_plans_id_fk" FOREIGN KEY ("workout_plan_id") REFERENCES "public"."workout_plans"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "default_workout_attributes" ADD CONSTRAINT "default_workout_attributes_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "default_workout_attributes" ADD CONSTRAINT "default_workout_attributes_workout_plan_id_workout_plans_id_fk" FOREIGN KEY ("workout_plan_id") REFERENCES "public"."workout_plans"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercises" ADD CONSTRAINT "exercises_category_id_exercise_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."exercise_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_workout_exercise_attributes" ADD CONSTRAINT "user_workout_exercise_attributes_workout_plan_id_workout_plans_id_fk" FOREIGN KEY ("workout_plan_id") REFERENCES "public"."workout_plans"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_workout_exercise_attributes" ADD CONSTRAINT "user_workout_exercise_attributes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_workout_exercise_attributes" ADD CONSTRAINT "user_workout_exercise_attributes_workout_exercise_id_workout_exercises_id_fk" FOREIGN KEY ("workout_exercise_id") REFERENCES "public"."workout_exercises"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "default_workout_exercise_attributes" ADD CONSTRAINT "default_workout_exercise_attributes_workout_plan_id_workout_plans_id_fk" FOREIGN KEY ("workout_plan_id") REFERENCES "public"."workout_plans"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "default_workout_exercise_attributes" ADD CONSTRAINT "default_workout_exercise_attributes_workout_exercise_id_workout_exercises_id_fk" FOREIGN KEY ("workout_exercise_id") REFERENCES "public"."workout_exercises"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user_fitness_profiles" DROP COLUMN IF EXISTS "age";--> statement-breakpoint
ALTER TABLE "public"."user_workout_attributes" ALTER COLUMN "attribute_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."user_workout_exercise_attributes" ALTER COLUMN "attribute_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."default_workout_attributes" ALTER COLUMN "attribute_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."default_workout_exercise_attributes" ALTER COLUMN "attribute_name" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."exercise_attribute_name";--> statement-breakpoint
CREATE TYPE "public"."exercise_attribute_name" AS ENUM('days_of_week', 'intensity_level', 'duration_goal', 'warmup_required', 'cooldown_required', 'rest_period_between_sets');--> statement-breakpoint
ALTER TABLE "public"."user_workout_attributes" ALTER COLUMN "attribute_name" SET DATA TYPE "public"."exercise_attribute_name" USING "attribute_name"::"public"."exercise_attribute_name";--> statement-breakpoint
ALTER TABLE "public"."user_workout_exercise_attributes" ALTER COLUMN "attribute_name" SET DATA TYPE "public"."exercise_attribute_name" USING "attribute_name"::"public"."exercise_attribute_name";--> statement-breakpoint
ALTER TABLE "public"."default_workout_attributes" ALTER COLUMN "attribute_name" SET DATA TYPE "public"."exercise_attribute_name" USING "attribute_name"::"public"."exercise_attribute_name";--> statement-breakpoint
ALTER TABLE "public"."default_workout_exercise_attributes" ALTER COLUMN "attribute_name" SET DATA TYPE "public"."exercise_attribute_name" USING "attribute_name"::"public"."exercise_attribute_name";