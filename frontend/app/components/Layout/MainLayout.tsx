// Import Icons from Ant Design
import {
	BarChartOutlined,
	BookOutlined,
	CalendarOutlined,
	DashboardOutlined,
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
	Dropdown,
	Flex,
	Layout,
	Menu,
	type MenuProps,
	Space,
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
			label: t("Profile"),
		},
		{
			key: "settings",
			icon: <SettingOutlined />,
			label: t("Settings"),
		},
		{
			type: "divider",
		},
		{
			key: "logout",
			icon: <LogoutOutlined />,
			label: t("Logout"),
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
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
					zIndex: 99,
				}}
			>
				<Space>
					{/* Logo */}
					<Logo />
				</Space>

				{/* Theme control */}
				<Button onClick={toggleTheme}>{selectedTheme}</Button>

				{/* Lamng Control */}
				<Button onClick={toggleLang}>{selectedLang}</Button>

				{/* User Menu */}
				<Dropdown
					menu={{ items: userMenuItems }}
					placement="bottomRight"
					trigger={["click"]}
				>
					<Space size="middle" className="cursor-pointer">
						<Avatar icon={<UserOutlined />} size="small" />
						<Text>User Name</Text>
					</Space>
				</Dropdown>
			</Header>

			{/* Sidebar and Content */}
			<Layout style={{ margin: "0.5rem 0" }}>
				{/* Sidebar */}
				<Sider
					trigger={null}
					collapsible
					collapsed={collapsed}
					breakpoint="lg"
					width={200}
					style={{ borderRight: "1px solid #e5e7eb" }}
				>
					<Flex
						vertical
						justify="space-between"
						style={{ height: "100%", padding: "0 0.5rem" }}
					>
						<Menu
							style={{ border: "none" }}
							mode="inline"
							selectedKeys={[location.pathname]}
							items={menuItems}
							onClick={({ key }) => navigate(key)}
						/>
						<TriggerButton collapsed={collapsed} setCollapsed={setCollapsed} />
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
