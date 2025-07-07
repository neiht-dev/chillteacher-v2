'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Spin } from 'antd';

interface ProtectedRouteProps {
	children: React.ReactNode;
	requiredRole?: 'admin' | 'teacher';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
	const { user, isLoading, isLoggedIn } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (!isLoading) {
			// If not logged in, redirect to login
			if (!isLoggedIn || !user) {
				const currentPath = window.location.pathname;
				router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
				return;
			}

			// If role is required and user doesn't have it, redirect to unauthorized page
			if (requiredRole && user.role !== requiredRole) {
				router.push('/unauthorized');
				return;
			}
		}
	}, [user, isLoading, isLoggedIn, requiredRole, router]);

	// Show loading spinner while checking authentication
	if (isLoading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<Spin size="large" />
			</div>
		);
	}

	// If not logged in, don't render children (will redirect)
	if (!isLoggedIn || !user) {
		return null;
	}

	// If role is required and user doesn't have it, don't render children
	if (requiredRole && user.role !== requiredRole) {
		return null;
	}

	// User is authenticated and authorized, render children
	return <>{children}</>;
};
