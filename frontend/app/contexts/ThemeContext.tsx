import { createContext, useContext, useEffect, useState } from "react";
import {
	getFromLocalStorage,
	LocalStorageKeys,
	setToLocalStorage,
} from "../utils/utils";

// Define enum for the theme
export enum Theme {
	Light = "light",
	Dark = "dark",
	System = "system",
}

// Define theme types
// SelectedTheme is the theme that the user has selected
// ActualTheme is the actual theme that is applied to the app
type SelectedTheme = Theme;
type ActualTheme = Exclude<Theme, Theme.System>;

// ThemeContextType is the type of the context
interface ThemeContextType {
	selectedTheme: SelectedTheme;
	actualTheme: ActualTheme;
	toggleTheme: () => void;
	setTheme: (theme: SelectedTheme) => void;
}

// ThemeContext is the context that is used to store the theme
// Undefined is used to indicate that the context is not yet defined
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Get system theme preference
const getSystemTheme = (): ActualTheme => {
	// Check if window is defined and matchMedia is supported
	if (typeof window !== "undefined" && window.matchMedia) {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? Theme.Dark
			: Theme.Light;
	}
	// Default to light theme
	return Theme.Light;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// Define the state for the selected theme
	// Initial value is the theme from the local storage
	// It can be system, light, or dark
	const [selectedTheme, setSelectedTheme] = useState<SelectedTheme>(
		getFromLocalStorage(LocalStorageKeys.THEME) || Theme.System,
	);

	// Define the state for the actual theme
	// Initial value is the system theme
	// It can be light or dark
	const [actualTheme, setActualTheme] = useState<ActualTheme>(getSystemTheme());

	// Resolve system theme to actual light/dark
	useEffect(() => {
		if (selectedTheme === Theme.System) {
			const systemTheme = getSystemTheme();
			setActualTheme(systemTheme);
		} else {
			setActualTheme(selectedTheme);
		}

		// Store the selected theme in the local storage
		setToLocalStorage(LocalStorageKeys.THEME, selectedTheme);
	}, [selectedTheme]);

	// Set the theme
	const setTheme = (newTheme: SelectedTheme) => {
		setSelectedTheme(newTheme);
	};

	// Toggle the theme
	const toggleTheme = () => {
		setSelectedTheme((prev) => {
			return prev === Theme.Light ? Theme.Dark : Theme.Light;
		});
	};

	// Return the ThemeProvider component
	return (
		<ThemeContext.Provider
			value={{
				selectedTheme,
				actualTheme,
				toggleTheme,
				setTheme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

// useTheme is the hook that is used to get the theme context
export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
