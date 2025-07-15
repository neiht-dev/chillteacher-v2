import { pgTable as table, pgEnum } from 'drizzle-orm/pg-core';
import { uuid, varchar, text, integer } from 'drizzle-orm/pg-core';
import { timestamp_cols } from '../helpers';

export const classStatus = pgEnum('class_status', ['active', 'inactive', 'completed']);

export const classes = table('classes', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 256 }).notNull(),
	grade: varchar('grade', { length: 16 }),
	section: varchar('section', { length: 8 }),
	subject: varchar('subject', { length: 128 }),
	teacher_id: uuid('teacher_id'),
	students: text('students'), // JSON string array
	capacity: integer('capacity').notNull().default(30),
	schedule: text('schedule'), // JSON string array
	status: classStatus().default('active'),
	...timestamp_cols,
});
