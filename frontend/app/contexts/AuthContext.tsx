import { createContext, useContext, useState } from "react";

interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "teacher";
	avatar?: string;
}

type AuthContextType = {
	user: User | null;
	signup: (name: string, email: string, password: string) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	// Mock signup and login
	const signup = async (name: string, email: string, _password: string) => {
		console.log("signup", name, email, _password);
		// TODO: Implement signup
		const mockUser: User = {
			id: "1",
			name,
			email,
			role: "admin",
		};
		setUser(mockUser);
	};

	const login = async (email: string, _password: string) => {
		console.log("login", email, _password);
		// TODO: Implement login
		const mockUser: User = {
			id: "1",
			name: "Admin",
			email,
			role: "admin",
		};
		setUser(mockUser);
	};

	const logout = () => {
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, signup, login, logout }}>
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
