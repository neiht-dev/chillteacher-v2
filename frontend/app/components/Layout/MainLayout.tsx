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
import {
	Avatar,
	Breadcrumb,
	Button,
	Dropdown,
	Layout,
	Menu,
	Space,
	Typography,
	theme,
} from "antd";
import type React from "react";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const MainLayout = () => {
	const [collapsed, setCollapsed] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { token } = theme.useToken();

	const menuItems = [
		{
			key: "/dashboard",
			icon: <DashboardOutlined />,
			label: "Dashboard",
		},
		{
			key: "/students",
			icon: <UserOutlined />,
			label: "Students",
		},
		{
			key: "/teachers",
			icon: <TeamOutlined />,
			label: "Teachers",
		},
		{
			key: "/classes",
			icon: <BookOutlined />,
			label: "Classes",
		},
		{
			key: "/classroom",
			icon: <ReadOutlined />,
			label: "Classroom",
		},
		{
			key: "/attendance",
			icon: <CalendarOutlined />,
			label: "Attendance",
		},
		{
			key: "/reports",
			icon: <BarChartOutlined />,
			label: "Reports",
		},
		{
			key: "/settings",
			icon: <SettingOutlined />,
			label: "Settings",
		},
	];

	const userMenuItems = [
		{
			key: "profile",
			icon: <UserOutlined />,
			label: "Profile",
		},
		{
			key: "settings",
			icon: <SettingOutlined />,
			label: "Settings",
		},
		{
			type: "divider" as const,
		},
		{
			key: "logout",
			icon: <LogoutOutlined />,
			label: "Logout",
		},
	];

	return (
		<Layout style={{ minHeight: "100vh" }}>
			{/* Header */}
			<Header className="flex justify-between items-center">
				<div className="flex items-center justify-center py-2">
					{/* Logo */}
					<Text>
						<Text
							style={{
								color: token.colorPrimary,
								fontSize: "24px",
								fontWeight: "bold",
							}}
						>
							Chill
						</Text>
						<Text
							style={{ color: "orange", fontSize: "24px", fontWeight: "bold" }}
						>
							Teacher
						</Text>
					</Text>
				</div>

				{/* User Menu */}
				<Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
					<Space size="middle" className="cursor-pointer">
						<Avatar icon={<UserOutlined />} size="small" />
						<Text style={{ color: token.colorText }}>User Name</Text>
					</Space>
				</Dropdown>
			</Header>

			{/* Sidebar and Content */}
			<Layout>
				{/* Sidebar */}
				<Sider trigger={null} collapsible collapsed={collapsed} width={256}>
					<Menu
						mode="inline"
						selectedKeys={[location.pathname]}
						items={menuItems}
						onClick={({ key }) => navigate(key)}
					/>
				</Sider>

				{/* Content */}
				<Content className="p-4 bg-amber-400">
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
};

export default MainLayout;
