import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
	theme: Theme;
	currentTheme: "light" | "dark"; // Resolved theme (system -> light/dark)
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Get system theme preference
const getSystemTheme = (): "light" | "dark" => {
	if (typeof window !== "undefined" && window.matchMedia) {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}
	return "light";
};

// Get stored theme from localStorage
const getStoredTheme = (): Theme => {
	if (typeof window !== "undefined") {
		const stored = localStorage.getItem("theme");
		return (stored as Theme) || "system";
	}
	return "system";
};

// Store theme in localStorage
const storeTheme = (theme: Theme) => {
	if (typeof window !== "undefined") {
		localStorage.setItem("theme", theme);
	}
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [theme, setThemeState] = useState<Theme>(getStoredTheme);
	const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

	// Resolve system theme to actual light/dark
	useEffect(() => {
		const resolveTheme = () => {
			if (theme === "system") {
				const systemTheme = getSystemTheme();
				setCurrentTheme(systemTheme);
			} else {
				setCurrentTheme(theme);
			}
		};

		resolveTheme();

		// Listen for system theme changes
		if (theme === "system" && typeof window !== "undefined") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			const handleChange = () => resolveTheme();

			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		}
	}, [theme]);

	// Store theme changes in localStorage
	useEffect(() => {
		storeTheme(theme);
	}, [theme]);

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
	};

	const toggleTheme = () => {
		setThemeState((prev) => {
			if (prev === "light") return "dark";
			if (prev === "dark") return "system";
			return "light";
		});
	};

	return (
		<ThemeContext.Provider
			value={{
				theme,
				currentTheme,
				toggleTheme,
				setTheme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
