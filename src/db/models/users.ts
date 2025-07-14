// import { AnyPgColumn } from 'drizzle-orm/pg-core';
import { pgEnum, pgTable as table } from 'drizzle-orm/pg-core';
import { uuid, timestamp, date, varchar, text, boolean, uniqueIndex } from 'drizzle-orm/pg-core';
import { timestamp_cols } from '../helpers';

export const role = pgEnum('roles', ['guest', 'user', 'admin']);
export const status = pgEnum('status', ['active', 'pending', 'suspended']);
export const membership = pgEnum('membership', ['free', 'premium', 'trial']);
export const gender = pgEnum('gender', ['male', 'female', 'other']);

export const users = table(
	'users',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		name: varchar('name', { length: 256 }).notNull(),
		display_name: varchar('display_name', { length: 256 }).notNull(),
		email: varchar('email', { length: 256 }).notNull(),
		email_verified: boolean('email_verified').notNull().default(false),
		password_hash: varchar('password_hash', { length: 256 }).notNull(),
		status: status().default('active'),
		role: role().default('guest'),
		avatar_url: varchar('avatar_url', { length: 512 }),
		last_login: timestamp('last_login', { withTimezone: true }),
		membership: membership().default('free'),
		gender: gender().default('other'),
		date_of_birth: date('date_of_birth'),
		phone: varchar('phone', { length: 32 }),
		bio: text('bio'),
		...timestamp_cols,
	},
	(table) => [uniqueIndex('email_idx').on(table.email)]
);
