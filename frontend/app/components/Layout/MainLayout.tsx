// Import Icons from Ant Design
import {
	BarChartOutlined,
	BookOutlined,
	BulbOutlined,
	CalendarOutlined,
	DashboardOutlined,
	GlobalOutlined,
	LogoutOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	ReadOutlined,
	SettingOutlined,
	TeamOutlined,
	UserOutlined,
} from "@ant-design/icons";

// Import Components from Ant Design
import {
	Avatar,
	Button,
	Divider,
	Dropdown,
	Flex,
	Layout,
	Menu,
	type MenuProps,
	Tooltip,
	Typography,
	theme,
} from "antd";

// Import React hooks and React Router
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

// Import LangContext
import { useLang } from "~/contexts/LangContext";

// Import ThemeContext
import { useTheme } from "~/contexts/ThemeContext";

// Destructure Layout components from Ant Design
const { Header, Sider, Content } = Layout;
const { Text } = Typography;

// Define the TriggerButton component
const TriggerButton = ({
	collapsed,
	setCollapsed,
}: {
	collapsed: boolean;
	setCollapsed: (collapsed: boolean) => void;
}) => {
	return (
		<Button
			style={{
				fontSize: "1.2rem",
				width: "100%",
				height: "2rem",
			}}
			type="text"
			icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
			onClick={() => setCollapsed(!collapsed)}
		/>
	);
};

// Define the Logo component
const Logo = () => {
	const { token } = theme.useToken();
	return (
		<Text>
			<Text
				style={{
					color: token.colorPrimary,
					fontSize: "20px",
					fontWeight: "bold",
				}}
			>
				Chill
			</Text>
			<Text style={{ color: "orange", fontSize: "20px", fontWeight: "bold" }}>
				Teacher
			</Text>
		</Text>
	);
};

// Define the MainLayout component
const MainLayout = () => {
	const [collapsed, setCollapsed] = useState(false);
	const { selectedTheme, toggleTheme } = useTheme();
	const { selectedLang, toggleLang, t } = useLang();
	const location = useLocation();
	const navigate = useNavigate();
	const { token } = theme.useToken();

	// Define the menu items
	const menuItems: MenuProps["items"] = [
		{
			key: "/dashboard",
			icon: <DashboardOutlined />,
			label: t("Dashboard"),
		},
		{
			key: "/students",
			icon: <UserOutlined />,
			label: t("Students"),
		},
		{
			key: "/teachers",
			icon: <TeamOutlined />,
			label: t("Teachers"),
		},
		{
			key: "/classes",
			icon: <BookOutlined />,
			label: t("Classes"),
		},
		{
			key: "/classroom",
			icon: <ReadOutlined />,
			label: t("Classroom"),
		},
		{
			key: "/attendance",
			icon: <CalendarOutlined />,
			label: t("Attendance"),
		},
		{
			key: "/reports",
			icon: <BarChartOutlined />,
			label: t("Reports"),
		},
		{
			key: "/settings",
			icon: <SettingOutlined />,
			label: t("Settings"),
		},
	];

	// Define the user menu items
	const userMenuItems: MenuProps["items"] = [
		{
			key: "profile",
			icon: <UserOutlined />,
			label: t("profile"),
		},
		{
			key: "settings",
			icon: <SettingOutlined />,
			label: t("settings"),
		},
		{
			type: "divider",
		},
		{
			key: "logout",
			icon: <LogoutOutlined />,
			label: t("logout"),
		},
	];

	// Return the MainLayout component
	return (
		<Layout style={{ minHeight: "100vh" }}>
			{/* Header */}
			<Header
				style={{
					height: "3rem",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					boxShadow: token.boxShadow,
					zIndex: 99,
					padding: "0 1rem",
				}}
			>
				{/* Left side - Logo */}
				<Logo />

				{/* Right side - Controls and User */}
				<Flex align="center" gap="middle">
					{/* Theme and Language Controls */}
					<Flex align="center" gap="small">
						<Tooltip
							title={
								selectedTheme === "dark"
									? t("Switch to Light Mode")
									: t("Switch to Dark Mode")
							}
						>
							<Button
								type="text"
								icon={<BulbOutlined />}
								onClick={toggleTheme}
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: "2rem",
									height: "2rem",
									borderRadius: "6px",
									color: token.colorTextSecondary,
								}}
							/>
						</Tooltip>

						<Tooltip
							title={
								selectedLang === "vi"
									? t("Switch to English")
									: t("Switch to Vietnamese")
							}
						>
							<Button
								type="text"
								icon={<GlobalOutlined />}
								onClick={toggleLang}
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: "2rem",
									height: "2rem",
									borderRadius: "6px",
									color: token.colorTextSecondary,
								}}
							/>
						</Tooltip>
					</Flex>

					{/* Divider */}
					<Divider type="vertical" style={{ height: "1.5rem", margin: "0" }} />

					{/* User Menu */}
					<Dropdown
						menu={{ items: userMenuItems }}
						placement="bottomRight"
						trigger={["click"]}
					>
						<Flex
							align="center"
							gap="small"
							className="cursor-pointer"
							style={{
								padding: "0.25rem 0.5rem",
								borderRadius: "6px",
								transition: "background-color 0.2s",
							}}
						>
							<Avatar
								icon={<UserOutlined />}
								size="small"
								style={{ backgroundColor: token.colorPrimary }}
							/>
							<Text style={{ fontSize: "0.875rem", color: token.colorText }}>
								User Name
							</Text>
						</Flex>
					</Dropdown>
				</Flex>
			</Header>

			{/* Sidebar and Content */}
			<Layout style={{ margin: "0.25rem 0.25rem" }}>
				{/* Sidebar */}
				<Sider
					trigger={null}
					collapsible
					collapsed={collapsed}
					breakpoint="lg"
					width={200}
					style={{ boxShadow: token.boxShadow, borderRadius: "10px" }}
				>
					<Flex vertical justify="space-between" style={{ height: "100%" }}>
						<Menu
							style={{ border: "none" }}
							mode="inline"
							selectedKeys={[location.pathname]}
							items={menuItems}
							onClick={({ key }) => navigate(key)}
						/>
						<div style={{ padding: "0.5rem" }}>
							<TriggerButton
								collapsed={collapsed}
								setCollapsed={setCollapsed}
							/>
						</div>
					</Flex>
				</Sider>

				{/* Content */}
				<Content style={{ padding: "1rem" }}>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
};

export default MainLayout;
