import { App as AntApp, ConfigProvider, theme } from "antd";
import { ThemeProvider, useTheme } from "./ThemeContext";

// Define theme light config
const themeLightConfig = {
	token: {
		colorPrimary: "#1890ff",
		borderRadius: 8,
		fontSize: 16,
		colorBgContainer: "#ffffff",
		colorBgElevated: "#ffffff",
		colorBorderSecondary: "#f0f0f0",
		colorText: "#262626",
		colorTextSecondary: "#8c8c8c",
		text: "234234",
	},
	algorithm: [theme.defaultAlgorithm, theme.compactAlgorithm],
	components: {
		Layout: {
			headerBg: "#ffffff",
			headerColor: "#262626",
			siderBg: "#ffffff",
			siderBorderColor: "#ffffff",
			bodyBg: "#ffffff",
		},
		Menu: {
			itemBg: "transparent",
			itemSelectedBg: "#e6f7ff",
			itemHoverBg: "#f5f5f5",
		},
	},
};

// Define theme dark config
const themeDarkConfig = {
	token: {
		borderRadius: 8,
		fontSize: 16,
	},
	algorithm: [theme.darkAlgorithm],
};

// Define AppContent to use contexts after being wrapped by Context Providers
const AppContent = ({ children }: { children: React.ReactNode }) => {
	const { theme } = useTheme();
	console.log("Current theme:", theme);
	
	return (
		<ConfigProvider
			theme={theme === "light" ? themeLightConfig : themeDarkConfig}
		>
			<AntApp>{children}</AntApp>
		</ConfigProvider>
	);
};

// Define AppProvider to use global Contexts
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider>
			<AppContent>{children}</AppContent>
		</ThemeProvider>
	);
};

