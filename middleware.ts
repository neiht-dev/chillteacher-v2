import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

export function middleware(request: NextRequest) {
	console.log('middleware');

	const { pathname } = request.nextUrl;

	// Get user from cookies or headers
	const user = request.cookies.get('user')?.value;
	const isAuthenticated = !!user;

	// Check if the route is protected
	const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

	// Check if the route is an auth route
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

	// Redirect to login if accessing protected route without authentication
	if (isProtectedRoute && !isAuthenticated) {
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('redirect', pathname);
		return NextResponse.redirect(loginUrl);
	}

	// Redirect to dashboard if accessing auth routes while authenticated
	if (isAuthRoute && isAuthenticated) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
