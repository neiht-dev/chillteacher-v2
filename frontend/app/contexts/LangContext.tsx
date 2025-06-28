import { createContext, useContext, useEffect, useState } from "react";
import { LocalStorageKeys, setToLocalStorage } from "~/utils/utils";
import { getFromLocalStorage } from "~/utils/utils";

// Define enum for the language selection
export enum LangOption {
	EN = "en",
	VI = "vi",
}

// Define the type for the language context
interface LangContextType {
	selectedLang: LangOption;
	toggleLang: () => void;
	setLang: (lang: LangOption) => void;
}

// LangContext is the context that is used to store the language
// Undefined is used to indicate that the context is not yet defined
const LangContext = createContext<LangContextType | undefined>(undefined);

// LangProvider is the provider that is used to wrap the app with the language context
export const LangProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// Define the state for the selected language
	// Initial value is the language from the local storage
	// It can be en or vi
	const [selectedLang, setSelectedLang] = useState<LangOption>(
		getFromLocalStorage(LocalStorageKeys.LANG) || LangOption.EN,
	);

	// Store the selected language in the local storage
	useEffect(() => {
		setToLocalStorage(LocalStorageKeys.LANG, selectedLang);
	}, [selectedLang]);

	// Define the function to toggle the language
	const toggleLang = () => {
		setSelectedLang((prev) => (prev === LangOption.EN ? LangOption.VI : LangOption.EN));
	};

	// Define the function to set the language
	const setLang = (lang: LangOption) => {
		setSelectedLang(lang);
	};

	// Return the LangProvider component
	return (
		<LangContext.Provider
			value={{
				selectedLang,
				toggleLang,
				setLang,
			}}
		>
			{children}
		</LangContext.Provider>
	);
};

// useLang is the hook that is used to get the language context
export const useLang = () => {
	const context = useContext(LangContext);
	if (context === undefined) {
		throw new Error("useLang must be used within a LangProvider");
	}
	return context;
};
