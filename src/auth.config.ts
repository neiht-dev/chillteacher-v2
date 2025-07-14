import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
	pages: {
		signIn: '/login',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user && user.id) {
				token.id = user.id;
				token.role = user.role || 'guest';
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as 'admin' | 'user' | 'guest';
			}
			return session;
		},
	},
	providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
