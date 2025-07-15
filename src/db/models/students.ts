import { pgTable as table, pgEnum } from 'drizzle-orm/pg-core';
import { uuid, varchar, text, date, integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { timestamp_cols } from '../helpers';

export const studentStatus = pgEnum('student_status', ['active', 'inactive', 'graduated']);
export const tuitionStatus = pgEnum('tuition_status', ['paid', 'pending', 'overdue']);

export const students = table(
	'students',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		name: varchar('name', { length: 256 }).notNull(),
		email: varchar('email', { length: 256 }).notNull(),
		phone: varchar('phone', { length: 32 }),
		class: varchar('class', { length: 32 }),
		grade: varchar('grade', { length: 16 }),
		status: studentStatus().default('active'),
		enrollment_date: date('enrollment_date'),
		avatar: varchar('avatar', { length: 512 }),
		address: text('address'),
		parent_name: varchar('parent_name', { length: 256 }),
		parent_phone: varchar('parent_phone', { length: 32 }),
		tuition_fee: integer('tuition_fee'),
		tuition_status: tuitionStatus().default('pending'),
		...timestamp_cols,
	},
	(table) => [uniqueIndex('student_email_idx').on(table.email)]
);
