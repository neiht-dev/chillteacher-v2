import { pgTable as table, pgEnum } from 'drizzle-orm/pg-core';
import { uuid, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { timestamp_cols } from '../helpers';
import { users } from './users';
import { classes } from './classes';

export const enrollmentStatus = pgEnum('enrollment_status', [
	'pending',
	'approved',
	'rejected',
	'cancelled',
]);

export const enrollments = table(
	'enrollments',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		student_id: uuid('student_id').notNull(),
		class_id: uuid('class_id').notNull(),
		status: enrollmentStatus().default('pending'),
		enrolled_at: timestamp('enrolled_at', { withTimezone: true }).notNull().defaultNow(),
		notes: text('notes'),
		...timestamp_cols,
	},
	(table) => [uniqueIndex('student_class_idx').on(table.student_id, table.class_id)]
);

// Relations
export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
	student: one(users, {
		fields: [enrollments.student_id],
		references: [users.id],
	}),
	class: one(classes, {
		fields: [enrollments.class_id],
		references: [classes.id],
	}),
}));
