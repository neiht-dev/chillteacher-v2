import { pgTable as table, pgEnum } from 'drizzle-orm/pg-core';
import { uuid, varchar, text } from 'drizzle-orm/pg-core';
import { timestamp_cols } from '../helpers';

export const schoolType = pgEnum('school_type', ['Public', 'Private']);
export const schoolStatus = pgEnum('school_status', ['Active', 'Inactive']);

export const schools = table('schools', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 256 }).notNull(),
	address: text('address'),
	email: varchar('email', { length: 256 }),
	phone: varchar('phone', { length: 32 }),
	type: schoolType().default('Public'),
	status: schoolStatus().default('Active'),
	...timestamp_cols,
});
