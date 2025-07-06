// Check the browser environment
export const isBrowser = () => typeof window !== 'undefined';

// Define the keys for the local storage
export enum LocalStorageKeys {
	THEME = 'theme',
	LANG = 'lang',
	USER = 'user',
}

// Get a value from the local storage
export const getFromLocalStorage = <T>(key: LocalStorageKeys): T | null => {
	if (isBrowser()) {
		const value = localStorage.getItem(key);
		if (value) {
			return JSON.parse(value) as T;
		}
	}
	return null;
};

// Set a value to the local storage
export const setToLocalStorage = <T>(key: LocalStorageKeys, value: T) => {
	if (isBrowser()) {
		localStorage.setItem(key, JSON.stringify(value));
	}
};

export const removeFromLocalStorage = (key: LocalStorageKeys) => {
	if (isBrowser()) {
		localStorage.removeItem(key);
	}
};
