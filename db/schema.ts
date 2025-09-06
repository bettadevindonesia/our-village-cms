import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, numeric, primaryKey } from "drizzle-orm/sqlite-core";

export const announcements = sqliteTable("announcements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category", { 
    enum: ['general', 'event', 'maintenance', 'official', 'urgent'] 
  }),
  priority: text("priority", { 
    enum: ['high', 'medium', 'low'] 
  }),
  notes: text("notes"),
  publishedAt: text("published_at").default(sql`(CURRENT_TIMESTAMP)`),
  expiresAt: text("expires_at"),
  isPublished: integer("is_published", { mode: "boolean" }).default(true),
  createdBy: integer("created_by").references(() => officials.id),
  slug: text("slug"),
  additionalInfo: text("additional_info")
});

export const certificates = sqliteTable("certificates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  documentNumber: text("document_number").notNull(),
  certificateType: text("certificate_type", { 
    enum: ['surat_keterangan_usaha', 'surat_keterangan_tidak_mampu', 'surat_keterangan_pengantar'] 
  }),
  applicantName: text("applicant_name").notNull(),
  placeOfBirth: text("place_of_birth").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  occupation: text("occupation").notNull(),
  address: text("address").notNull(),
  businessName: text("business_name"),
  businessType: text("business_type"),
  businessAddress: text("business_address"),
  businessYears: text("business_years"),
  rtRwLetterNumber: text("rt_rw_letter_number").notNull(),
  rtRwLetterDate: text("rt_rw_letter_date").notNull(),
  gender: text("gender"),
  religion: text("religion"),
  purpose: text("purpose"),
  nationality: text("nationality"),
  familyCardNumber: text("family_card_number"),
  nationalIdNumber: text("national_id_number"),
  validFromDate: text("valid_from_date"),
  remarks: text("remarks"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`)
});

export const documentSequences = sqliteTable("document_sequences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  certificateType: text("certificate_type").notNull(),
  year: integer("year").notNull(),
  currentNumber: integer("current_number").default(0),
  prefixCode: text("prefix_code").notNull(),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`)
}, (table) => {
  return {
    certificateTypeYearUnique: primaryKey({ columns: [table.certificateType, table.year] })
  };
});

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  additionalInfo: text("additional_info"),
  eventDate: text("event_date").notNull(),
  eventTime: text("event_time"),
  location: text("location").notNull(),
  category: text("category"),
  contactInfo: text("contact_info"),
  isPublished: integer("is_published", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  createdBy: integer("created_by").references(() => officials.id),
  slug: text("slug")
});

export const officials = sqliteTable("officials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  position: text("position").notNull(),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`)
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value"),
  description: text("description"),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`)
});

// User Authentication and Authorization Tables
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role", { 
    enum: ['admin', 'official', 'staff', 'user'] 
  }).default('user'),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  lastLogin: text("last_login"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`)
});

export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`)
});

export const permissions = sqliteTable("permissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`)
});

export const rolePermissions = sqliteTable("role_permissions", {
  roleId: integer("role_id").notNull().references(() => roles.id),
  permissionId: integer("permission_id").notNull().references(() => permissions.id)
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.roleId, table.permissionId] })
  };
});

export const userSessions = sqliteTable("user_sessions", {
  id: text("id").notNull().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  expiresAt: integer("expires_at").notNull(), // Unix timestamp
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`)
});

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at").notNull(), // Unix timestamp
  used: integer("used", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`)
});

export const emailVerificationTokens = sqliteTable("email_verification_tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at").notNull(), // Unix timestamp
  used: integer("used", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`)
});
