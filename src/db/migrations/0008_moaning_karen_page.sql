ALTER TABLE "workout_plans" DROP CONSTRAINT "workout_plans_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "workout_plans" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "workout_plans" DROP COLUMN IF EXISTS "duration";