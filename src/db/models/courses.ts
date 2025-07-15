import { pgTable as table } from 'drizzle-orm/pg-core';
import { uuid, varchar, text, integer, boolean, uniqueIndex } from 'drizzle-orm/pg-core';
import { timestamp_cols } from '../helpers';

export const courses = table(
	'courses',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		name: varchar('name', { length: 256 }).notNull(),
		description: text('description'),
		code: varchar('code', { length: 50 }).notNull(),
		credits: integer('credits').notNull().default(3),
		duration: integer('duration').notNull().default(60), // minutes
		is_active: boolean('is_active').notNull().default(true),
		...timestamp_cols,
	},
	(table) => [uniqueIndex('course_code_idx').on(table.code)]
);
