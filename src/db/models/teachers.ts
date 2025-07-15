import { pgTable as table, pgEnum } from 'drizzle-orm/pg-core';
import { uuid, varchar, text, date, integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { timestamp_cols } from '../helpers';

export const teacherStatus = pgEnum('teacher_status', ['active', 'inactive', 'on-leave']);

export const teachers = table(
	'teachers',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		name: varchar('name', { length: 256 }).notNull(),
		email: varchar('email', { length: 256 }).notNull(),
		phone: varchar('phone', { length: 32 }),
		department: varchar('department', { length: 128 }),
		subjects: text('subjects'), // JSON string array
		status: teacherStatus().default('active'),
		joining_date: date('joining_date'),
		avatar: varchar('avatar', { length: 512 }),
		address: text('address'),
		qualification: varchar('qualification', { length: 256 }),
		experience: integer('experience'),
		salary: integer('salary'),
		classes: text('classes'), // JSON string array
		schedule: text('schedule'), // JSON string array
		...timestamp_cols,
	},
	(table) => [uniqueIndex('teacher_email_idx').on(table.email)]
);
