'use client';

import { message } from 'antd';
import { createContext, useContext, useEffect, useState } from 'react';

// Import translations
import translations from '@/utils/translations/translations';

// Import utils for local storage
import { getFromLocalStorage, LocalStorageKeys, setToLocalStorage } from '@/utils/utils';

// Define enum for the language selection
export enum LangOption {
	EN = 'en',
	VI = 'vi',
}

// Define the type for the language context
interface LangContextType {
	selectedLang: LangOption;
	toggleLang: () => void;
	t: (key: string) => string;
}

// LangContext is the context that is used to store the language
// Undefined is used to indicate that the context is not yet defined
const LangContext = createContext<LangContextType | undefined>(undefined);

// LangProvider is the provider that is used to wrap the app with the language context
export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	// Define the state for the selected language
	// Initial value is the language from the local storage
	// It can be en or vi
	const [selectedLang, setSelectedLang] = useState<LangOption>(LangOption.EN);

	// UseEffect to safely get the language from the local storage
	useEffect(() => {
		const lang = getFromLocalStorage(LocalStorageKeys.LANG);
		if (lang) {
			setSelectedLang(lang as LangOption);
		}
	}, []);

	// Store the selected language in the local storage
	useEffect(() => {
		setToLocalStorage(LocalStorageKeys.LANG, selectedLang);
	}, [selectedLang]);

	// Define the function to toggle the language
	const toggleLang = () => {
		const newLang = selectedLang === LangOption.EN ? LangOption.VI : LangOption.EN;
		if (newLang === LangOption.EN) {
			message.success('Language changed to English');
		} else {
			message.success('Ngôn ngữ đã thay đổi thành Tiếng Việt');
		}
		setSelectedLang(newLang);
	};

	// Define the function to translate the text
	const t = (key: string): string => {
		// Return translation or throw error if not found
		const translation = translations[selectedLang][key];
		if (translation) {
			return translation;
		}
		throw new Error(`Translation not found for key: ${key}`);
	};

	// Return the LangProvider component
	return (
		<LangContext.Provider
			value={{
				selectedLang,
				toggleLang,
				t,
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
		throw new Error('useLang must be used within a LangProvider');
	}
	return context;
};
