import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth.edge';

// Define protected routes
const protectedRoutes = [
	'/dashboard',
	'/students',
	'/teachers',
	'/classes',
	'/classroom',
	'/attendance',
	'/reports',
	'/settings',
	'/profile',
	'/schools',
];

// Define auth routes (login, signup, etc.)
const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
	const session = await auth();
	const { pathname } = request.nextUrl;

	const isAuthenticated = !!session;

	const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

	if (isProtectedRoute && !isAuthenticated) {
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('redirect', pathname);
		return NextResponse.redirect(loginUrl);
	}

	if (isAuthRoute && isAuthenticated) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
