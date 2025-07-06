'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';

interface User {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'teacher';
	avatar?: string;
}

type AuthContextType = {
	user: User | null;
	isLoading: boolean;
	isLoggedIn: boolean;
	signup: (name: string, email: string, password: string) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Check for stored user on app start
	useEffect(() => {
		const storedUser = getCookie('user');
		if (storedUser) {
			try {
				const userData = typeof storedUser === 'string' ? JSON.parse(storedUser) : storedUser;
				setUser(userData);
				setIsLoggedIn(true);
			} catch (error) {
				console.error('Error parsing user data:', error);
				deleteCookie('user');
			}
		} else {
			setIsLoggedIn(false);
		}
		setIsLoading(false);
	}, []);

	// Mock signup
	const signup = async (name: string, email: string, _password: string) => {
		setIsLoading(true);
		setIsLoggedIn(false);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log('signup', name, email, _password);
			// TODO: Implement signup
			const mockUser: User = {
				id: '1',
				name,
				email,
				role: 'admin',
			};
			setUser(mockUser);
			setCookie('user', JSON.stringify(mockUser), {
				maxAge: 60 * 60 * 24 * 7, // 7 days
				httpOnly: false, // Allow client-side access
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
			});
		} finally {
			setIsLoading(false);
			setIsLoggedIn(true);
		}
	};

	// Mock login
	const login = async (email: string, password: string) => {
		setIsLoading(true);
		setIsLoggedIn(false);
		try {
			// Mock API call - replace with real authentication
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (email === 'demo@example.com' && password === 'password') {
				const mockUser: User = {
					id: '1',
					email,
					name: 'Demo User',
					role: 'admin',
				};
				setUser(mockUser);
				setCookie('user', JSON.stringify(mockUser), {
					maxAge: 60 * 60 * 24 * 7, // 7 days
					httpOnly: false, // Allow client-side access
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
				});
			} else {
				throw new Error('Invalid credentials');
			}
		} finally {
			setIsLoading(false);
			setIsLoggedIn(true);
		}
	};

	const logout = () => {
		setUser(null);
		setIsLoggedIn(false);
		deleteCookie('user');
	};

	return (
		<AuthContext.Provider value={{ user, isLoading, isLoggedIn, signup, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
