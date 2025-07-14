import { timestamp } from 'drizzle-orm/pg-core';

export const timestamp_cols = {
	created: timestamp('created', { withTimezone: true }).notNull().defaultNow(),
	updated: timestamp('updated', { withTimezone: true }).notNull().defaultNow(),
	deleted: timestamp('deleted', { withTimezone: true }),
};
