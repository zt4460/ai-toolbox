import { pgTable, serial, timestamp, varchar, boolean, integer, text, index, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// 健康检查表
export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 用户表
export const users = pgTable(
	"users",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		email: varchar("email", { length: 255 }),
		username: varchar("username", { length: 64 }),
		phone: varchar("phone", { length: 32 }),
		password_hash: varchar("password_hash", { length: 255 }).notNull(),
		is_active: boolean("is_active").default(true).notNull(),
		is_admin: boolean("is_admin").default(false).notNull(),
		credits: integer("credits").default(0).notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }),
		last_login_at: timestamp("last_login_at", { withTimezone: true }),
	},
	(table) => [
		index("users_email_idx").on(table.email),
		index("users_username_idx").on(table.username),
		index("users_phone_idx").on(table.phone),
		index("users_created_at_idx").on(table.created_at),
	]
);

// 验证码表
export const verificationCodes = pgTable(
	"verification_codes",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		email: varchar("email", { length: 255 }),
		phone: varchar("phone", { length: 32 }),
		code: varchar("code", { length: 8 }).notNull(),
		type: varchar("type", { length: 32 }).notNull(),
		expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
		used: boolean("used").default(false).notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("verification_codes_email_idx").on(table.email),
		index("verification_codes_phone_idx").on(table.phone),
	]
);

// 卡密表
export const activationCodes = pgTable(
	"activation_codes",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		code: varchar("code", { length: 64 }).notNull().unique(),
		card_type: varchar("card_type", { length: 32 }).notNull(),
		points: integer("points").default(0).notNull(),
		days: integer("days").default(0).notNull(),
		price: integer("price").default(0).notNull(),
		is_used: boolean("is_used").default(false).notNull(),
		is_disabled: boolean("is_disabled").default(false).notNull(),
		used_by: varchar("used_by", { length: 36 }).references(() => users.id),
		used_at: timestamp("used_at", { withTimezone: true }),
		expires_at: timestamp("expires_at", { withTimezone: true }),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("activation_codes_code_idx").on(table.code),
		index("activation_codes_used_by_idx").on(table.used_by),
	]
);

// 生成记录表
export const generations = pgTable(
	"generations",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
		type: varchar("type", { length: 32 }).notNull(),
		preset: varchar("preset", { length: 64 }),
		prompt: text("prompt").notNull(),
		parameters: jsonb("parameters").default(sql`'{}'::jsonb`).notNull(),
		result_url: varchar("result_url", { length: 2048 }),
		status: varchar("status", { length: 32 }).default("pending").notNull(),
		credits_used: integer("credits_used").default(0).notNull(),
		provider: varchar("provider", { length: 64 }),
		provider_model: varchar("provider_model", { length: 128 }),
		provider_task_id: varchar("provider_task_id", { length: 255 }),
		error_message: text("error_message"),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }),
	},
	(table) => [
		index("generations_user_id_idx").on(table.user_id),
		index("generations_created_at_idx").on(table.created_at),
		index("generations_status_idx").on(table.status),
		index("generations_type_idx").on(table.type),
		index("generations_preset_idx").on(table.preset),
		index("generations_provider_idx").on(table.provider),
	]
);
