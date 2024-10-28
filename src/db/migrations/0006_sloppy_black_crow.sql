ALTER TABLE "workouts" DROP CONSTRAINT "workouts_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "workouts" DROP COLUMN IF EXISTS "user_id";