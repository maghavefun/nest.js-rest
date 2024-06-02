CREATE TABLE IF NOT EXISTS "user_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"pass_hash" varchar NOT NULL,
	"salt" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" varchar(256) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");