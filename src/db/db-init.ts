import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './models';

export const db = drizzle({
	schema,
	connection: {
		connectionString: process.env.DATABASE_URL,
	},
	casing: 'snake_case',
});

export async function checkDb() {
	try {
		console.log('🔌 Testing database connection...');

		// Test the database connection
		const result = await db.execute('SELECT 1 as test');
		console.log('✅ Database connection successful:', result);

		// Add any other initialization logic here
		// For example:
		// - Check if required tables exist
		// - Create default admin user if none exists
		// - Set up any required database functions or triggers

		console.log('🚀 Database initialization completed');
		return true;
	} catch (error) {
		console.error('❌ Database initialization failed:', error);
		throw error;
	}
}
