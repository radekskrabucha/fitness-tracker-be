ALTER TABLE "exercises" ALTER COLUMN "name" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "description" SET DATA TYPE varchar(1024);--> statement-breakpoint
ALTER TABLE "muscle_groups" ALTER COLUMN "name" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "workout_plans" ALTER COLUMN "name" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "workout_plans" ALTER COLUMN "description" SET DATA TYPE varchar(1024);--> statement-breakpoint
ALTER TABLE "workouts" ALTER COLUMN "name" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "workouts" ALTER COLUMN "description" SET DATA TYPE varchar(1024);--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_name_unique" UNIQUE("name");