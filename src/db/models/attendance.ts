import { pgTable as table, pgEnum } from 'drizzle-orm/pg-core';
import { uuid, varchar, date, text } from 'drizzle-orm/pg-core';
import { timestamp_cols } from '../helpers';

export const attendanceStatus = pgEnum('attendance_status', [
	'present',
	'absent',
	'late',
	'excused',
]);

export const attendance = table('attendance', {
	id: uuid('id').primaryKey().defaultRandom(),
	student_id: uuid('student_id').notNull(),
	date: date('date').notNull(),
	status: attendanceStatus().default('present'),
	reason: text('reason'),
	arrival_time: varchar('arrival_time', { length: 16 }),
	...timestamp_cols,
});
