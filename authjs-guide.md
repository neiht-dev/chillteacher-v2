# NextAuth.js v5 Credentials Authentication Guide (Detailed)

This comprehensive guide will walk you through setting up robust user authentication in your Next.js application using NextAuth.js v5 and the Credentials provider. We will cover every step, from initial setup to handling user registration, login, session management, and type safety, tailored specifically to your project structure.

## 1. Introduction to NextAuth.js

NextAuth.js is a complete open-source authentication solution for Next.js applications. It supports various authentication strategies (providers) like OAuth (Google, GitHub), Email/Password, and Credentials (custom login forms). For your application, we are implementing the **Credentials provider**, which allows users to log in with a username (email) and password stored in your database.

**Key Benefits:**
*   **Security:** Handles secure session management, token generation, and protects against common vulnerabilities.
*   **Flexibility:** Easily integrate with various databases and authentication flows.
*   **Simplicity:** Provides a streamlined API for common authentication tasks.

## 2. Prerequisites

Before we dive into the code, ensure you have the following:

*   **Node.js and npm/yarn:** Installed on your system.
*   **Next.js Project:** Your existing Next.js project (which we are currently working on).
*   **Database:** A PostgreSQL database (as indicated by your `drizzle-orm/pg-core` usage) with a `users` table.
*   **Environment Variables:**
    *   `DATABASE_URL`: Your PostgreSQL connection string (e.g., `postgresql://user:password@host:port/database`).
    *   `NEXTAUTH_SECRET`: A long, random string used to sign and encrypt tokens. You can generate one using `openssl rand -base64 32` or `openssl rand -base64 64`. **Keep this secret and do not commit it to version control.** Add it to your `.env.local` file:
        ```
        NEXTAUTH_SECRET="YOUR_SUPER_SECRET_KEY_HERE"
        DATABASE_URL="postgresql://user:password@host:port/database"
        ```

## 3. Core NextAuth.js Setup

This section details the central configuration for NextAuth.js.

### 3.1. `src/auth.config.ts` - NextAuth.js Base Configuration

This file defines the core configuration for NextAuth.js, including pages and callbacks, but *without* any providers. This configuration is shared between Node.js and Edge environments.

```typescript
// src/auth.config.ts

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
	providers: [], // Providers are added in auth.ts and auth.edge.ts
} satisfies NextAuthConfig;
```

**Explanation of `src/auth.config.ts`:**

*   **`authConfig`**: This object holds the common NextAuth.js configuration, such as custom `pages` for sign-in and `callbacks` for JWT and session management.
*   **`providers: []`**: The `providers` array is intentionally left empty here. Specific providers (like `Credentials`) are added in environment-specific `NextAuth` instances to manage Node.js dependencies.

### 3.2. `src/auth.ts` - Node.js-Specific NextAuth.js Configuration

This file defines the `Credentials` provider and exports it along with the shared `authConfig`. It is intended to be used in Node.js environments (like API routes) where `bcrypt` is supported.

```typescript
// src/auth.ts

import { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/db/db-init';
import { users } from '@/db/models/users';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { authConfig } from './auth.config';

export { authConfig }; // Export the shared authConfig

export const credentialsProvider = Credentials({
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  authorize: async (credentials): Promise<User | null> => {
    const parsedCredentials = z
      .object({ email: z.string().email(), password: z.string().min(6) })
      .safeParse(credentials);

    if (parsedCredentials.success) {
      const { email, password } = parsedCredentials.data;
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      }) as (typeof users.$inferSelect) | undefined;

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
```

**Explanation of `src/auth.ts`:**

*   **`export { authConfig }`**: Re-exports the base configuration.
*   **`credentialsProvider`**: This constant holds the `Credentials` provider configuration, including the `authorize` function that uses `bcrypt`. This separation ensures that `bcrypt` is only bundled and executed in Node.js environments.

### 3.3. `src/auth.edge.ts` - Edge-Specific NextAuth.js Configuration

This file creates a `NextAuth` instance specifically for the Edge runtime. It uses the shared `authConfig` but *does not* include the `Credentials` provider, as `bcrypt` is not supported in Edge environments.

```typescript
// src/auth.edge.ts

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { auth } = NextAuth({
  ...authConfig,
  providers: [], // No providers for Edge runtime to avoid Node.js dependencies
});
```

**Explanation of `src/auth.edge.ts`:**

*   **`export const { auth } = NextAuth(...)`**: This creates the `NextAuth` instance that will be used by Edge functions (like `middleware.ts`).
*   **`providers: []`**: Crucially, the `providers` array is empty here. This prevents any Node.js-specific dependencies (like `bcrypt` from the `Credentials` provider) from being included in the Edge bundle, resolving the `crypto` module error.

### 3.4. `src/app/api/auth/[...nextauth]/route.ts` - API Route Handler (Node.js)

This file acts as the entry point for all NextAuth.js API requests (e.g., `/api/auth/signin`, `/api/auth/signout`). It creates the Node.js-specific `NextAuth` instance that includes the `Credentials` provider.

```typescript
// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import { authConfig, credentialsProvider } from '@/auth'; // Import authConfig and credentialsProvider

const { handlers } = NextAuth({
  ...authConfig,
  providers: [credentialsProvider], // Include Credentials provider for Node.js environment
});

export const { GET, POST } = handlers;
```

**Explanation of `src/app/api/auth/[...nextauth]/route.ts`:**

*   **`import { authConfig, credentialsProvider } from '@/auth'`**: Imports the base configuration and the `Credentials` provider.
*   **`NextAuth({ ...authConfig, providers: [credentialsProvider] })`**: This creates the full `NextAuth` instance with the `Credentials` provider. Since this file runs in a Node.js environment, `bcrypt` can be used without issues.
*   **`export const { GET, POST } = handlers`**: Exports the `GET` and `POST` handlers for NextAuth.js API routes.

## 4. User Registration (Signup)

Since NextAuth.js's Credentials provider primarily handles *login*, we need a separate API endpoint for user registration (signup).

### 4.1. `src/app/api/auth/register/route.ts` - Registration API

This new API route will handle creating new user accounts in your database, including securely hashing their passwords.

```typescript
// src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/db/db-init'; // Your Drizzle ORM database instance
import { users } from '@/db/models/users'; // Your Drizzle ORM users schema
import { z } from 'zod'; // Zod for schema validation
import bcrypt from 'bcrypt'; // bcrypt for password hashing

const saltRounds = 10; // Number of salt rounds for bcrypt hashing (higher is more secure, but slower)

export async function POST(request: Request) {
  try {
    // Parse the request body as JSON
    const body = await request.json();

    // 1. Validate incoming registration data using Zod
    const parsedBody = z
      .object({
        name: z.string().min(2), // User's name, minimum 2 characters
        email: z.string().email(), // User's email, must be a valid email format
        password: z.string().min(6), // User's password, minimum 6 characters
      })
      .safeParse(body); // Use safeParse for robust error handling

    // If validation fails, return a 400 Bad Request response
    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Extract validated data
    const { name, email, password } = parsedBody.data;

    // 2. Hash the password securely using bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Insert the new user into the database
    // `display_name` is set to `name` for simplicity, adjust as needed.
    // `password_hash` stores the securely hashed password.
    const newUser = await db
      .insert(users)
      .values({
        name,
        display_name: name,
        email,
        password_hash: hashedPassword,
      })
      .returning(); // Return the newly created user record

    // Return the created user (excluding sensitive data like password_hash)
    return NextResponse.json(newUser[0]);
  } catch (error) {
    console.error(error); // Log the error for debugging
    // Return a generic 500 Internal Server Error for unexpected issues
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Explanation of `src/app/api/auth/register/route.ts`:**

*   **`POST(request: Request)`**: This function handles `POST` requests to `/api/auth/register`.
*   **Zod Validation**: Similar to the login, we validate the `name`, `email`, and `password` provided by the user.
*   **Password Hashing (`bcrypt.hash`)**: This is crucial for security. Instead of storing plain text passwords, we use `bcrypt` to generate a one-way hash of the password. This hash is then stored in the `password_hash` column of your `users` table. If your database already contains plain text passwords, you'll need a migration strategy to hash them.
*   **Database Insertion (`db.insert(users).values(...)`)**: The new user's data, including the hashed password, is inserted into your `users` table.
*   **Error Handling**: Basic error handling is included to catch validation errors and server-side issues.

### 4.2. `src/app/(auth)/signup/page.tsx` - Updating the Signup Page

Your existing signup page needs to be updated to call the new registration API.

```typescript
// src/app/(auth)/signup/page.tsx

'use client';

import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, App as AntApp } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { ThemeLangControl } from '@/components/ui/ThemeLangControl';
import { useLang } from '@/contexts/LangContext';
import { useState } from 'react'; // Import useState for loading state

const SignUpPage = () => {
	const { message } = AntApp.useApp();
	const router = useRouter();
	const { t } = useLang();
	const [isLoading, setIsLoading] = useState(false); // State to manage loading indicator

	const handleSubmit = async (values: {
		name: string;
		email: string;
		password: string;
		confirmPassword: string; // confirmPassword is used for client-side validation only
	}) => {
		setIsLoading(true); // Set loading to true when form is submitted
		try {
			// Make a POST request to your new registration API route
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				// Send only name, email, and password to the API
				body: JSON.stringify({
					name: values.name,
					email: values.email,
					password: values.password,
				}),
			});

			if (response.ok) {
				// If registration is successful, show success message and redirect to login
				message.success(t('Account created successfully!'));
				router.push('/login');
			} else {
				// If registration fails, show an error message
				message.error(t('Failed to create account'));
			}
		} catch (error) {
			// Catch any network or unexpected errors
			message.error(t('Failed to create account'));
			console.error(error);
		} finally {
			setIsLoading(false); // Always set loading to false after the request
		}
	};

	return (
		<Card
			style={{
				width: '100%',
				maxWidth: 400,
				boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
			}}
		>
			<div style={{ textAlign: 'center', marginBottom: 32 }}>
				<Logo />
				<p style={{ color: '#64748b', marginTop: 8 }}>{t('Create a new account')}</p>
			</div>

			<Form name="signup" onFinish={handleSubmit} layout="vertical" size="large">
				<Form.Item
					label={t('User name')}
					name="name"
					rules={[
						{ required: true, message: t('Please enter your name') },
						{ min: 2, message: t('Name must be at least 2 characters') },
					]}
				>
					<Input prefix={<UserOutlined />} placeholder={t('Enter your name')} />
				</Form.Item>

				<Form.Item
					label={t('Email')}
					name="email"
					rules={[
						{ required: true, message: t('Please enter your email') },
						{ type: 'email', message: t('Please enter a valid email') },
					]}
				>
					<Input prefix={<MailOutlined />} placeholder={t('Enter your email')} />
				</Form.Item>

				<Form.Item
					label={t('Password')}
					name="password"
					rules={[
						{ required: true, message: t('Please enter your password') },
						{ min: 6, message: t('Password must be at least 6 characters') },
					]}
				>
					<Input.Password prefix={<LockOutlined />} placeholder={t('Enter your password')} />
				</Form.Item>

				<Form.Item
					label={t('Confirm password')}
					name="confirmPassword"
					dependencies={['password']} // This field depends on the 'password' field
					rules={[
						{ required: true, message: t('Please confirm your password') },
						// Custom validator to check if passwords match
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue('password') === value) {
									return Promise.resolve(); // Passwords match or no value yet
								}
								return Promise.reject(new Error(t('Passwords do not match'))); // Passwords don't match
							},
						}),
					]}
				>
					<Input.Password prefix={<LockOutlined />} placeholder={t('Confirm your password')} />
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						loading={isLoading} // Use the isLoading state for the button
						style={{ width: '100%', height: 48 }}
					>
						{t('Sign up')}
					</Button>
				</Form.Item>
			</Form>

			<div style={{ textAlign: 'center' }}>
				<span style={{ color: '#64748b' }}>{t('Have an account?')} </span>
				<Link href="/login" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>
					{t('Login here')}
				</Link>
			</div>
			<div style={{ marginTop: 16 }}>
				<ThemeLangControl />
			</div>
		</Card>
	);
};

export default SignUpPage;
```

**Explanation of `src/app/(auth)/signup/page.tsx`:**

*   **`handleSubmit` Function**:
    *   We now use the standard `fetch` API to send a `POST` request to `/api/auth/register`.
    *   The `body` of the request contains the `name`, `email`, and `password` (the `confirmPassword` is only for client-side validation and is not sent to the API).
    *   We handle the `response.ok` property to determine if the registration was successful.
    *   `isLoading` state is added to provide visual feedback to the user during the registration process.
*   **Ant Design Form**: The form structure remains largely the same, but the `onFinish` handler now calls our new `handleSubmit` function.

## 5. User Login

The login page will now use NextAuth.js's `signIn` function to authenticate users.

### 5.1. `src/app/(auth)/login/page.tsx` - Updating the Login Page

```typescript
// src/app/(auth)/login/page.tsx

'use client';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, App as AntApp } from 'antd';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { ThemeLangControl } from '@/components/ui/ThemeLangControl';
import { useLang } from '@/contexts/LangContext';
import { signIn } from 'next-auth/react'; // Import the signIn function from NextAuth.js
import { useState } from 'react'; // Import useState for loading state

const LoginPage = () => {
	const { message } = AntApp.useApp();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { t } = useLang();
	const [isLoading, setIsLoading] = useState(false); // State to manage loading indicator

	const handleSubmit = async (values: { email: string; password: string }) => {
		setIsLoading(true); // Set loading to true when form is submitted
		// Call NextAuth.js's signIn function
		const result = await signIn('credentials', {
			redirect: false, // IMPORTANT: We handle the redirect ourselves for more control
			email: values.email,
			password: values.password,
		});

		if (result?.error) {
			// If signIn returns an error, it means authentication failed
			message.error(t('Invalid email or password'));
		} else {
			// If authentication is successful, redirect the user
			const redirectTo = searchParams.get('redirect') || '/dashboard'; // Redirect to original page or dashboard
			router.push(redirectTo);
		}
		setIsLoading(false); // Always set loading to false after the request
	};

	return (
		<Card
			style={{
				width: '100%',
				maxWidth: 400,
				boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
			}}
		>
			<div style={{ textAlign: 'center', marginBottom: 32 }}>
				<Logo />
				<p style={{ color: '#64748b', marginTop: 8 }}>{t('Login to your account')}</p>
			</div>

			<Form name="login" onFinish={handleSubmit} layout="vertical" size="large">
				<Form.Item
					label={t('Email')}
					name="email"
					rules={[
						{ required: true, message: t('Please enter your email') },
						{ type: 'email', message: t('Please enter a valid email') },
					]}
				>
					<Input prefix={<UserOutlined />} placeholder={t('Enter your email')} />
				</Form.Item>

				<Form.Item
					label={t('Password')}
					name="password"
					rules={[
						{ required: true, message: t('Please enter your password') },
						{ min: 6, message: t('Password must be at least 6 characters') },
					]}
				>
					<Input.Password prefix={<LockOutlined />} placeholder={t('Enter your password')} />
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						loading={isLoading} // Use the isLoading state for the button
						style={{
							width: '100%',
							height: 48,
						}}
					>
						{t('Login')}
					</Button>
				</Form.Item>
			</Form>

			<div style={{ textAlign: 'center' }}>
				<span style={{ color: '#64748b' /* gray-600 */ }}>{t("Don't have an account?")} </span>
				<Link
					href="/signup"
					style={{
						color: '#3b82f6', // blue-600
						fontWeight: 500,
						textDecoration: 'none',
					}}
				>
					{t('Sign up here')}
				</Link>
			</div>
			<div style={{ marginTop: 16 }}>
				<ThemeLangControl />
			</div>
		</Card>
	);
};

export default LoginPage;
```

**Explanation of `src/app/(auth)/login/page.tsx`:**

*   **`signIn('credentials', { ... })`**: This is the core change. We call the `signIn` function provided by `next-auth/react`.
    *   The first argument `'credentials'` specifies that we are using the Credentials provider.
    *   The second argument is an object containing the `email` and `password` from the form.
    *   **`redirect: false`**: This is crucial. By default, `signIn` will redirect the user automatically on success. Setting it to `false` gives us manual control over the redirection, allowing us to redirect to a specific page (like the original requested page or `/dashboard`).
*   **Error Handling**: If `signIn` fails (e.g., invalid credentials), `result.error` will contain an error message. We display this to the user.
*   **Redirection**: On successful login, the user is redirected to the page they originally tried to access (if a `redirect` query parameter exists) or to `/dashboard`.
*   **`isLoading` State**: Provides visual feedback during the login process.

## 6. Session Management and Route Protection

Next.js Middleware is the ideal place to protect routes based on authentication status.

### 6.1. `middleware.ts` - Protecting Routes

```typescript
// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth.edge'; // Import the Edge-compatible auth function

// Define routes that require authentication
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

// Define routes that should only be accessible to unauthenticated users
const authRoutes = ['/login', '/signup'];

// Middleware function
export async function middleware(request: NextRequest) {
    // Get the user's session using the NextAuth.js `auth` function
    // This function reads the session from the request cookies.
    const session = await auth();
    const { pathname } = request.nextUrl; // Get the current path

    // Determine if the user is authenticated based on the session
    const isAuthenticated = !!session;

    // Check if the current route is a protected route
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    // Check if the current route is an authentication route
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Logic for protected routes:
    // If accessing a protected route AND not authenticated, redirect to login.
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        // Add a 'redirect' query parameter so the user can be sent back after login
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Logic for authentication routes:
    // If accessing an auth route AND already authenticated, redirect to dashboard.
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If no redirection is needed, continue to the next middleware or page
    return NextResponse.next();
}

// Configuration for the middleware matcher
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes - NextAuth.js handles these internally)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
```

**Explanation of `middleware.ts`:**

*   **`import { auth } from '@/auth.edge'`**: We now import the `auth` function from `src/auth.edge.ts`, which is the Edge-compatible `NextAuth` instance.
*   **`const session = await auth()`**: This line is the core of session checking in middleware. It asynchronously retrieves the user's session. If a user is logged in, `session` will contain their data; otherwise, it will be `null`.
*   **`isAuthenticated = !!session`**: A simple boolean check to determine if a session exists.
*   **Route Protection Logic**:
    *   If a user tries to access a `protectedRoute` and is `!isAuthenticated`, they are redirected to the `/login` page. A `redirect` query parameter is added to the login URL so that after successful login, the user can be sent back to the page they originally intended to visit.
    *   If a user tries to access an `authRoute` (like `/login` or `/signup`) and is already `isAuthenticated`, they are redirected to the `/dashboard` to prevent them from seeing login/signup forms when already logged in.
*   **`config.matcher`**: This configuration tells Next.js which paths the middleware should run on. We exclude API routes, static assets, and the favicon, as NextAuth.js handles its own API routes, and static assets don't require authentication.

## 7. Accessing Session Data in Components

To access the authenticated user's session data in your React components, you need to wrap your application with a `SessionProvider`.

### 7.1. `src/app/providers.tsx` - Session Provider

This file creates a client-side component that wraps your application with NextAuth.js's `SessionProvider`.

```typescript
// src/app/providers.tsx

'use client'; // Mark this component as a Client Component

import { SessionProvider } from 'next-auth/react'; // Import SessionProvider

// This component wraps your application to provide session context
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

**Explanation of `src/app/providers.tsx`:**

*   **`'use client'`**: This directive is essential because `SessionProvider` (and `useSession` hook) are client-side functionalities.
*   **`SessionProvider`**: This component makes the session data available to all nested client components via the `useSession` hook.

### 7.2. `src/app/layout.tsx` - Integrating the Session Provider

Your root layout file needs to use the `Providers` component to wrap your entire application.

```typescript
// src/app/layout.tsx

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@ant-design/v5-patch-for-react-19';
import './globals.css';
import { Providers } from './providers'; // Import your new Providers component

// Import database initialization (will auto-run in development)
import { checkDb } from '@/db/db-init';
checkDb(); // Ensure database connection is checked on server start

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'ChillTeacher',
	description:
		'ChillTeacher is a web application that allows you to manage your schools, students, teachers, and classes. It is designed to be user-friendly and easy to use.',
};

import { AppProvider } from '@/contexts/AppContext'; // Your existing AppContext
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<Providers> {/* Wrap your AppProvider and children with the NextAuth.js Providers */}
					<AppProvider>{children}</AppProvider>
				</Providers>
			</body>
		</html>
	);
}
```

**Explanation of `src/app/layout.tsx`:**

*   **`import { Providers } from './providers'`**: We import the `Providers` component.
*   **`<Providers>{children}</Providers>`**: By wrapping your `AppProvider` (and thus your entire application) with `Providers`, the NextAuth.js session context becomes available throughout your client-side components.

### 7.3. Accessing Session in Client Components (`useSession`)

In any client-side React component (marked with `'use client'`), you can now use the `useSession` hook to get the current user's session data.

```typescript
// Example: src/components/SomeClientComponent.tsx

'use client';

import { useSession } from 'next-auth/react'; // Import the useSession hook

function MyClientComponent() {
  const { data: session, status } = useSession(); // Destructure session data and status

  if (status === 'loading') {
    return <p>Loading authentication status...</p>; // Show loading state
  }

  if (session) {
    // If session exists, user is authenticated
    return (
      <div>
        <p>Welcome, {session.user?.name || session.user?.email}!</p>
        <p>Your ID: {session.user?.id}</p>
        <p>Your Role: {session.user?.role}</p>
        {/* You can also use the signOut function */}
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  // If no session, user is not authenticated
  return <p>You are not logged in.</p>;
}
```

**Explanation of `useSession`:**

*   **`data: session`**: The `data` property (renamed to `session` for clarity) holds the session object if the user is authenticated, or `null` otherwise. The `session` object will contain the `user` property with `id`, `name`, `email`, and `role` (as defined in your `jwt` and `session` callbacks).
*   **`status`**: This property indicates the authentication status:
    *   `'loading'`: The session is currently being fetched.
    *   `'authenticated'`: The user is logged in.
    *   `'unauthenticated'`: The user is not logged in.
*   **`signOut()`**: This function (also from `next-auth/react`) allows you to programmatically log out the user.

### 7.4. Accessing Session in Server Components (`auth`)

In Server Components, you can directly import and use the `auth` function from your `src/auth.edge.ts` file.

```typescript
// Example: src/app/dashboard/page.tsx (Server Component)

import { auth } from '@/auth.edge'; // Import the server-side auth function from auth.edge.ts

async function DashboardPage() {
  const session = await auth(); // Get the session directly

  if (!session) {
    // If no session, user is not authenticated.
    // In a real app, you might redirect them or show a login prompt.
    return <p>Please log in to view the dashboard.</p>;
  }

  // If session exists, user is authenticated
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hello, {session.user?.name || session.user?.email}!</p>
      <p>Your Role: {session.user?.role}</p>
      {/* Render dashboard content */}
    </div>
  );
}

export default DashboardPage;
```

**Explanation of `auth` in Server Components:**

*   **`const session = await auth()`**: The `auth` function can be directly awaited in Server Components to get the session data. This is efficient as it runs on the server and doesn't require client-side JavaScript.
*   **No `status`**: Unlike `useSession`, the `auth` function doesn't return a `status` property because it's a direct, synchronous (from the component's perspective) check on the server.

## 8. Type Extensions for NextAuth.js

To ensure type safety and proper autocompletion for your custom `id` and `role` properties within the NextAuth.js session and JWT, you need to extend NextAuth.js's default types.

### 8.1. `src/types/next-auth.d.ts` - Extending NextAuth.js Types

Create this file to declare your custom types.

```typescript
// src/types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Extend the NextAuth module
declare module "next-auth" {
  // Extend the Session interface to include custom user properties
  interface Session {
    user: {
      id: string; // Your custom user ID
      // Define the possible roles, matching your database enum
      role: "admin" | "user" | "guest";
    } & DefaultSession["user"]; // Merge with default session user properties
  }

  // Extend the User interface to include custom properties from your database
  interface User extends DefaultUser {
    role: "admin" | "user" | "guest"; // Your custom user role
    password_hash?: string; // Include password_hash for internal use in authorize callback (optional)
  }
}

// Extend the NextAuth/JWT module
declare module "next-auth/jwt" {
  // Extend the JWT interface to include custom properties stored in the token
  interface JWT extends DefaultJWT {
    id: string; // Your custom user ID
    role: "admin" | "user" | "guest"; // Your custom user role
  }
}
```

**Explanation of `src/types/next-auth.d.ts`:**

*   **`declare module "next-auth"`**: This tells TypeScript that you are adding to the existing `next-auth` module.
*   **`interface Session`**: We extend the `Session` interface to add your custom `id` and `role` properties to the `user` object within the session. This ensures that when you access `session.user.id` or `session.user.role`, TypeScript knows about them.
*   **`interface User`**: This extends the `User` interface that NextAuth.js uses internally (e.g., in the `authorize` callback). We add `role` and `password_hash` here. Note that `password_hash` is marked as optional (`?`) because it's only used internally for comparison and not exposed to the client.
*   **`declare module "next-auth/jwt"`**: This extends the JWT (JSON Web Token) interface.
*   **`interface JWT`**: We add `id` and `role` to the `JWT` interface. These are the properties that will be serialized into the actual JWT token.

**Important Note on `role` Type:**
The `role` type (`"admin" | "user" | "guest"`) in `next-auth.d.ts` **must exactly match** the `pgEnum` definition in your `src/db/models/users.ts` file. If your database enum changes, you must update this type definition accordingly.

## 9. Database Schema Integration

For Drizzle ORM to correctly infer types and allow querying your `users` table, you need to ensure your database instance is initialized with the schema.

### 9.1. `src/db/models/index.ts` - Exporting All Models

This file serves as a central export for all your Drizzle ORM models.

```typescript
// src/db/models/index.ts

export * from './users'; // Export all entities from users.ts
// Add other model files here as you create them, e.g., export * from './products';
```

**Explanation of `src/db/models/index.ts`:**

*   This file simply re-exports everything from `users.ts`. This pattern is useful for organizing your Drizzle schemas and making them easily importable as a single `schema` object.

### 9.2. `src/db/db-init.ts` - Initializing Drizzle with Schema

Your database initialization file needs to import and pass the entire schema to the Drizzle ORM instance.

```typescript
// src/db/db-init.ts

import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './models'; // Import all your Drizzle models as a schema object
import { Pool } from 'pg'; // Import Pool for better connection management

// Create a new PostgreSQL Pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle ORM with the database connection pool and your schema
export const db = drizzle(pool, {
	schema, // Pass the imported schema here
	casing: 'snake_case', // Maintain snake_case for database column names
});

export async function checkDb() {
	try {
		console.log('🔌 Testing database connection...');

		// Test the database connection by executing a simple query
		await db.execute('SELECT 1 as test');
		console.log('✅ Database connection successful.');

		// Add any other initialization logic here, e.g., migrations, default data
		console.log('🚀 Database initialization completed');
		return true;
	} catch (error) {
		console.error('❌ Database initialization failed:', error);
		throw error; // Re-throw the error to indicate a critical failure
	}
}
```

**Explanation of `src/db/db-init.ts`:**

*   **`import * as schema from './models'`**: This imports all your Drizzle models (exported from `index.ts`) as a single `schema` object.
*   **`export const db = drizzle(pool, { schema, ... })`**: The `schema` object is now passed to the `drizzle` function. This allows Drizzle to understand the structure of your database tables and generate correct types for your queries (e.g., `db.query.users`).
*   **`Pool`**: Using `pg.Pool` is generally better for managing database connections in a Node.js application, as it handles connection pooling efficiently.

## 10. Final Steps and Important Considerations

### 10.1. Install `bcrypt`

If you haven't already, install `bcrypt` and its type definitions:

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

### 10.2. Update `AuthContext.tsx`

Your existing `AuthContext.tsx` now becomes redundant for authentication logic, as NextAuth.js handles it. You should update it to simply expose the session data from `useSession` and the `signOut` function.

```typescript
// src/contexts/AuthContext.tsx

'use client';

import { createContext, useContext } from 'react';
import { useSession, signOut } from 'next-auth/react'; // Import useSession and signOut

// Define the User interface to match your NextAuth.js types
interface User {
	id: string;
	name?: string | null; // Name can be optional or null
	email?: string | null; // Email can be optional or null
	role: 'admin' | 'teacher' | 'guest' | 'user'; // Match your defined roles
	avatar?: string; // Optional avatar URL
}

// Define the shape of your AuthContext
type AuthContextType = {
	user: User | null; // The authenticated user object
	isLoading: boolean; // True while session is loading
	isLoggedIn: boolean; // True if user is authenticated
	logout: () => void; // Function to log out the user
};

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap your application
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	// Use the useSession hook to get session data and status
	const { data: session, status } = useSession();

	// Map NextAuth.js session data to your User interface
	const user = session?.user as User | null;
	const isLoading = status === 'loading';
	const isLoggedIn = status === 'authenticated';

	// Define the logout function using NextAuth.js's signOut
	const logout = () => {
		signOut(); // This will clear the session and redirect to the sign-in page (if configured)
	};

	return (
		<AuthContext.Provider value={{ user, isLoading, isLoggedIn, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
```

**Explanation of `src/contexts/AuthContext.tsx`:**

*   **`useSession`**: This hook from `next-auth/react` is now the primary source of authentication state.
*   **`user`, `isLoading`, `isLoggedIn`**: These values are derived directly from the `session` data and `status`.
*   **`logout`**: This function now simply calls `signOut()` from `next-auth/react`, which handles clearing the session and redirecting the user.
*   **Removed `signup` and `login`**: The custom `signup` and `login` functions are removed as they are now handled by the new API route and `signIn` function respectively.

### 10.3. Remove `ProtectedRoute.tsx`

Since the `middleware.ts` now handles route protection using NextAuth.js, the `ProtectedRoute.tsx` component is no longer needed and has been removed.

### 10.4. Environment Variables

Ensure your `.env.local` file has the `NEXTAUTH_SECRET` and `DATABASE_URL` set correctly.

```
NEXTAUTH_SECRET="your_generated_secret_key"
DATABASE_URL="postgresql://user:password@host:port/database_name"
```

### 10.5. Running Your Application

After all these changes, you can run your Next.js application:

```bash
npm run dev
```

Your application should now be running with NextAuth.js handling authentication.

## 11. Authentication Flow

Understanding the authentication flow is crucial for debugging and extending your Next.js application with NextAuth.js. Due to the separation of Node.js and Edge runtimes, the flow is slightly more nuanced.

### 11.1. Login Flow (Credentials Provider)

1.  **User Submits Login Form (`src/app/(auth)/login/page.tsx`)**:
    *   The client-side `LoginPage` calls `signIn('credentials', { email, password, redirect: false })`.
2.  **NextAuth.js Client-Side Request**:
    *   `signIn` makes a `POST` request to `/api/auth/callback/credentials`.
3.  **Next.js API Route Handler (`src/app/api/auth/[...nextauth]/route.ts`)**:
    *   This API route, running in a **Node.js environment**, receives the `POST` request.
    *   It uses the `NextAuth` instance configured with `authConfig` and `credentialsProvider`.
    *   The `authorize` function within `credentialsProvider` is executed.
    *   **Database Query**: `db.query.users.findFirst` is called to retrieve the user from the PostgreSQL database.
    *   **Password Verification**: `bcrypt.compare` is used to securely verify the provided password against the stored hash. This step is critical and requires the Node.js `crypto` module, which is why it runs here.
    *   If authentication is successful, a `User` object is returned.
4.  **Session Creation**:
    *   NextAuth.js creates a secure session (typically stored in a cookie) and a JSON Web Token (JWT).
    *   The `jwt` callback (defined in `src/auth.config.ts`) is executed, adding `user.id` and `user.role` to the JWT.
    *   The `session` callback (also in `src/auth.config.ts`) is executed, making `user.id` and `user.role` available in the client-side session.
5.  **Client-Side Redirection**:
    *   Back on the `LoginPage`, `signIn` returns. Since `redirect: false` was set, the page handles the redirection manually using `router.push('/dashboard')` (or the `redirect` query parameter).

### 11.2. Route Protection Flow (Middleware)

1.  **Incoming Request**:
    *   A user makes a request to a Next.js route (e.g., `/dashboard`).
2.  **Next.js Middleware Execution (`middleware.ts`)**:
    *   The `middleware.ts` file, running in the **Edge runtime**, intercepts the request.
    *   It imports `auth` from `src/auth.edge.ts`.
    *   **`const session = await auth()`**: This function is called to retrieve the session. Since `src/auth.edge.ts`'s `NextAuth` instance has no providers, it primarily relies on reading the existing session cookie. It does *not* attempt to use `bcrypt` or any Node.js-specific modules.
3.  **Authentication Check**:
    *   `isAuthenticated` is determined based on the presence of a session.
4.  **Redirection Logic**:
    *   If the route is protected (`isProtectedRoute`) and the user is not authenticated (`!isAuthenticated`), the middleware returns a `NextResponse.redirect('/login')`.
    *   If the route is an authentication route (`isAuthRoute`) and the user is already authenticated (`isAuthenticated`), the middleware returns a `NextResponse.redirect('/dashboard')`.
5.  **Continue to Page**:
    *   If no redirection is needed, `NextResponse.next()` is called, allowing the request to proceed to the intended page.

### 11.3. Accessing Session Data Flow

*   **Client Components (`useSession`)**:
    1.  In a client component (e.g., `src/components/SomeClientComponent.tsx`), `useSession()` is called.
    2.  This hook fetches the session data from the NextAuth.js client-side context (which is populated by the `SessionProvider` in `src/app/providers.tsx`).
    3.  The `data` (session object) and `status` (`'loading'`, `'authenticated'`, `'unauthenticated'`) are returned, allowing the component to render conditionally.
*   **Server Components (`auth`)**:
    1.  In a server component (e.g., `src/app/dashboard/page.tsx`), `const session = await auth()` is called.
    2.  This `auth` function (imported from `src/auth.edge.ts`) directly reads the session cookie from the incoming request on the server.
    3.  The session object is returned, allowing the server component to render content based on the authenticated user's data. This is efficient as it avoids an additional API call from the client.

## 12. Further Enhancements

*   **Error Messages**: Provide more specific error messages to the user (e.g., "Email already exists" during signup).
*   **Password Reset**: Implement a password reset flow.
*   **Email Verification**: Add email verification for new user registrations.
*   **Social Logins**: Integrate other NextAuth.js providers like Google or GitHub for social logins.
*   **UI/UX**: Enhance the user interface for login, signup, and session display.

This detailed guide should provide you with a solid understanding and implementation of NextAuth.js v5 with the Credentials provider in your Next.js application.
