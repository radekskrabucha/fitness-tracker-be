CREATE TYPE "public"."workout_attribute_name" AS ENUM('days_of_week', 'intensity_level', 'duration_goal', 'warmup_required', 'cooldown_required', 'rest_period_between_sets');

ALTER TABLE "user_workout_attributes" 
ALTER COLUMN "attribute_name" SET DATA TYPE text;

ALTER TABLE "user_workout_attributes" 
ALTER COLUMN "attribute_name" SET DATA TYPE workout_attribute_name 
USING "attribute_name"::workout_attribute_name;

ALTER TABLE "default_workout_attributes" 
ALTER COLUMN "attribute_name" SET DATA TYPE text;

ALTER TABLE "default_workout_attributes" 
ALTER COLUMN "attribute_name" SET DATA TYPE workout_attribute_name 
USING "attribute_name"::workout_attribute_name;

ALTER TABLE "public"."user_workout_exercise_attributes" 
ALTER COLUMN "attribute_name" SET DATA TYPE text;

ALTER TABLE "public"."default_workout_exercise_attributes" 
ALTER COLUMN "attribute_name" SET DATA TYPE text;

DROP TYPE "public"."exercise_attribute_name";

CREATE TYPE "public"."exercise_attribute_name" AS ENUM('sets', 'reps', 'weight', 'duration', 'distance');

ALTER TABLE "public"."user_workout_exercise_attributes" 
ALTER COLUMN "attribute_name" SET DATA TYPE text;

ALTER TABLE "public"."user_workout_exercise_attributes" 
ALTER COLUMN "attribute_name" SET DATA TYPE "public"."exercise_attribute_name" 
USING "attribute_name"::"public"."exercise_attribute_name";

ALTER TABLE "public"."default_workout_exercise_attributes" 
ALTER COLUMN "attribute_name" SET DATA TYPE text;

ALTER TABLE "public"."default_workout_exercise_attributes" 
ALTER COLUMN "attribute_name" SET DATA TYPE "public"."exercise_attribute_name" 
USING "attribute_name"::"public"."exercise_attribute_name";