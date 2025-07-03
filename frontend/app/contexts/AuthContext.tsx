import { createContext, useContext, useEffect, useState } from "react";
import {
	getFromLocalStorage,
	LocalStorageKeys,
	removeFromLocalStorage,
	setToLocalStorage,
} from "~/utils/utils";

interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "teacher";
	avatar?: string;
}

type AuthContextType = {
	user: User | null;
	isLoading: boolean;
	signup: (name: string, email: string, password: string) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Check for stored user on app start
	useEffect(() => {
		const storedUser = getFromLocalStorage(LocalStorageKeys.USER) as User;
		console.log(storedUser);
		if (storedUser) {
			setUser(storedUser);
		}
		setIsLoading(false);
	}, []);

	// Mock signup
	const signup = async (name: string, email: string, _password: string) => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log("signup", name, email, _password);
			// TODO: Implement signup
			const mockUser: User = {
				id: "1",
				name,
				email,
				role: "admin",
			};
			setUser(mockUser);
			setToLocalStorage(LocalStorageKeys.USER, mockUser);
		} finally {
			setIsLoading(false);
		}
	};

	// Mock login
	const login = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			// Mock API call - replace with real authentication
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (email === "demo@example.com" && password === "password") {
				const mockUser: User = {
					id: "1",
					email,
					name: "Demo User",
					role: "admin",
				};
				setUser(mockUser);
				setToLocalStorage(LocalStorageKeys.USER, mockUser);
			} else {
				throw new Error("Invalid credentials");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		removeFromLocalStorage(LocalStorageKeys.USER);
	};

	return (
		<AuthContext.Provider value={{ user, isLoading, signup, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
