CREATE TABLE IF NOT EXISTS "exercise_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(256),
	CONSTRAINT "exercise_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "category_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercises" ADD CONSTRAINT "exercises_category_id_exercise_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."exercise_categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "category";--> statement-breakpoint
DROP TYPE "public"."exercise_category";