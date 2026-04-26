import { pgTable, serial, timestamp, varchar, boolean, integer, text, jsonb, index } from "drizzle-orm/pg-core"
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
		nickname: varchar("nickname", { length: 64 }),
		avatar_url: varchar("avatar_url", { length: 512 }),
		is_active: boolean("is_active").default(true).notNull(),
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
		type: varchar("type", { length: 32 }).notNull(), // 'register', 'reset_password', 'login'
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
		card_type: varchar("card_type", { length: 32 }).notNull(), // 'day_30', 'day_90', 'day_365', 'points_100', 'points_500', 'points_1000'
		points: integer("points").default(0).notNull(),
		days: integer("days").default(0).notNull(),
		price: integer("price").default(0).notNull(), // 价格（分）
		is_used: boolean("is_used").default(false).notNull(),
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

// 积分充值记录表
export const creditTransactions = pgTable(
	"credit_transactions",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
		type: varchar("type", { length: 32 }).notNull(), // 'recharge', 'consume', 'refund', 'activation'
		amount: integer("amount").notNull(), // 正数增加，负数减少
		balance_before: integer("balance_before").notNull(),
		balance_after: integer("balance_after").notNull(),
		source: varchar("source", { length: 64 }), // 'alipay', 'wechat', 'activation_code', 'refund'
		related_id: varchar("related_id", { length: 36 }), // 关联的充值记录或卡密ID
		description: text("description"),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("credit_transactions_user_id_idx").on(table.user_id),
		index("credit_transactions_created_at_idx").on(table.created_at),
	]
);

// 需求投稿表
export const submissions = pgTable(
	"submissions",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		user_id: varchar("user_id", { length: 36 }).references(() => users.id),
		title: varchar("title", { length: 255 }).notNull(),
		description: text("description").notNull(),
		category: varchar("category", { length: 64 }), // 'feature', 'bug', 'improvement', 'other'
		priority: varchar("priority", { length: 32 }).default('normal'), // 'low', 'normal', 'high', 'urgent'
		status: varchar("status", { length: 32 }).default('pending'), // 'pending', 'reviewed', 'accepted', 'rejected', 'completed'
		contact: varchar("contact", { length: 128 }), // 联系方式
		attachments: jsonb("attachments"), // 附件URL列表
		admin_reply: text("admin_reply"),
		replied_at: timestamp("replied_at", { withTimezone: true }),
		completed_at: timestamp("completed_at", { withTimezone: true }),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }),
	},
	(table) => [
		index("submissions_user_id_idx").on(table.user_id),
		index("submissions_status_idx").on(table.status),
		index("submissions_created_at_idx").on(table.created_at),
	]
);
