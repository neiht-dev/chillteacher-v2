import { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/db/db-init';
import { users } from '@/db/models/users';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { authConfig } from './auth.config';

export { authConfig };

export const credentialsProvider = Credentials({
	credentials: {
		email: { label: 'Email', type: 'email' },
		password: { label: 'Password', type: 'password' },
	},
	authorize: async (credentials): Promise<User | null> => {
		const parsedCredentials = z
			.object({ email: z.email(), password: z.string().min(6) })
			.safeParse(credentials);

		if (parsedCredentials.success) {
			const { email, password } = parsedCredentials.data;
			const user = (await db.query.users.findFirst({
				where: eq(users.email, email),
			})) as typeof users.$inferSelect | undefined;

			if (!user) {
				return null;
			}

			if (!user.password_hash) {
				return null;
			}
			const passwordsMatch = await bcrypt.compare(password, user.password_hash);

			if (passwordsMatch) {
				return {
					id: user.id,
					name: user.name as string | null | undefined,
					email: user.email as string | null | undefined,
					role: user.role || 'guest',
				};
			}
		}

		return null;
	},
});
