'use client';

import { createContext, useContext } from 'react';
import { useSession, signOut } from 'next-auth/react';

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
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { data: session, status } = useSession();

	const user = session?.user as User | null;
	const isLoading = status === 'loading';
	const isLoggedIn = status === 'authenticated';

	const logout = () => {
		signOut();
	};

	return (
		<AuthContext.Provider value={{ user, isLoading, isLoggedIn, logout }}>
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
