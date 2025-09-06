CREATE TABLE `announcements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`category` text,
	`priority` text,
	`notes` text,
	`published_at` text DEFAULT (CURRENT_TIMESTAMP),
	`expires_at` text,
	`is_published` integer DEFAULT true,
	`created_by` integer,
	`slug` text,
	`additional_info` text,
	FOREIGN KEY (`created_by`) REFERENCES `officials`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`document_number` text NOT NULL,
	`certificate_type` text,
	`applicant_name` text NOT NULL,
	`place_of_birth` text NOT NULL,
	`date_of_birth` text NOT NULL,
	`occupation` text NOT NULL,
	`address` text NOT NULL,
	`business_name` text,
	`business_type` text,
	`business_address` text,
	`business_years` text,
	`rt_rw_letter_number` text NOT NULL,
	`rt_rw_letter_date` text NOT NULL,
	`gender` text,
	`religion` text,
	`purpose` text,
	`nationality` text,
	`family_card_number` text,
	`national_id_number` text,
	`valid_from_date` text,
	`remarks` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `document_sequences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`certificate_type` text NOT NULL,
	`year` integer NOT NULL,
	`current_number` integer DEFAULT 0,
	`prefix_code` text NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	PRIMARY KEY(`certificate_type`, `year`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`additional_info` text,
	`event_date` text NOT NULL,
	`event_time` text,
	`location` text NOT NULL,
	`category` text,
	`contact_info` text,
	`is_published` integer DEFAULT true,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`created_by` integer,
	`slug` text,
	FOREIGN KEY (`created_by`) REFERENCES `officials`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `officials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`position` text NOT NULL,
	`description` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`setting_key` text NOT NULL,
	`setting_value` text,
	`description` text,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_setting_key_unique` ON `settings` (`setting_key`);