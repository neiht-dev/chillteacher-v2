import loginTranslations from './login';
import mainLayoutTranslations from './main-layout';
import signupTranslations from './signup';

const translations: Record<string, Record<string, string>> = {
	en: {
		...mainLayoutTranslations.en,
		...loginTranslations.en,
		...signupTranslations.en,
	},
	vi: {
		...mainLayoutTranslations.vi,
		...loginTranslations.vi,
		...signupTranslations.vi,
	},
};

export default translations;
