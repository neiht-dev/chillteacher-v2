import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/db/models',
	out: './migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: `${process.env.DATABASE_URL}`,
	},
	verbose: true,
	strict: true,
	casing: 'snake_case',
});
