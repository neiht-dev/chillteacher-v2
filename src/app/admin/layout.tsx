'use client';

// Import Icons from Ant Design
import {
	BookOutlined,
	CalendarOutlined,
	LogoutOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	SettingOutlined,
	TeamOutlined,
	UserOutlined,
	BankOutlined,
	AppstoreOutlined,
} from '@ant-design/icons';

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
	Typography,
	theme,
} from 'antd';

// Import React hooks and Next.js
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// Import Components
import { Logo } from '@/components/ui/Logo';
import { ThemeLangControl } from '@/components/ui/ThemeLangControl';

// Import contexts
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LangContext';

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
				fontSize: '1.2rem',
				width: '100%',
				height: '2rem',
			}}
			type="text"
			icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
			onClick={() => setCollapsed(!collapsed)}
		/>
	);
};

// Define the MainLayout component
const MainLayout = ({ children }: { children: React.ReactNode }) => {
	const [collapsed, setCollapsed] = useState(true);
	const { t } = useLang();
	const pathname = usePathname();
	const router = useRouter();
	const { token } = theme.useToken();
	const { user, logout } = useAuth();

	// Define the menu items
	const menuItems: MenuProps['items'] = [
		{
			key: '/admin/students',
			icon: <UserOutlined />,
			label: <Link href="/admin/students">Học sinh</Link>,
		},
		{
			key: '/admin/teachers',
			icon: <TeamOutlined />,
			label: <Link href="/admin/teachers">Giáo viên</Link>,
		},
		{
			key: '/admin/schools',
			icon: <BankOutlined />,
			label: <Link href="/admin/schools">Trường học</Link>,
		},
		{
			key: '/admin/classes',
			icon: <AppstoreOutlined />,
			label: <Link href="/admin/classes">Lớp học</Link>,
		},
		{
			key: '/admin/courses',
			icon: <BookOutlined />,
			label: <Link href="/admin/courses">Khoá học</Link>,
		},
		{
			key: '/admin/attendance',
			icon: <CalendarOutlined />,
			label: <Link href="/admin/attendance">Điểm danh</Link>,
		},
		{
			key: '/admin/enrollments',
			icon: <BookOutlined />,
			label: <Link href="/admin/enrollments">Ghi danh</Link>,
		},
		{
			key: '/admin/users',
			icon: <UserOutlined />,
			label: <Link href="/admin/users">Tài khoản</Link>,
		},
	];

	// Define the user menu items
	const userMenuItems: MenuProps['items'] = [
		{
			key: '/profile',
			icon: <UserOutlined />,
			label: t('Profile'),
		},
		{
			key: '/settings',
			icon: <SettingOutlined />,
			label: t('Settings'),
		},
		{
			type: 'divider',
		},
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: t('Logout'),
		},
	];

	// Handle menu item clicks
	const handleMenuClick = ({ key }: { key: string }) => {
		if (key === 'logout') {
			logout();
			router.push('/login');
		} else {
			router.push(key);
		}
	};

	// Return the MainLayout component
	return (
		<Layout style={{ minHeight: '100vh' }}>
			{/* Header */}
			<Header
				style={{
					height: '3rem',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					boxShadow: token.boxShadow,
					zIndex: 1,
					padding: '0 1rem',
				}}
			>
				{/* Left side - Logo */}
				<Logo />
				{/* Right side - Controls and User */}
				<Flex align="center" gap="middle">
					{/* Theme and Language Controls */}
					<ThemeLangControl />

					{/* Divider */}
					<Divider type="vertical" style={{ height: '1.5rem', margin: '0' }} />

					{/* User Menu */}
					<Dropdown
						menu={{ items: userMenuItems, onClick: handleMenuClick }}
						placement="bottomRight"
						trigger={['click']}
					>
						<Flex
							align="center"
							gap="small"
							className="cursor-pointer"
							style={{
								padding: '0.25rem 0.5rem',
								borderRadius: '6px',
								transition: 'background-color 0.2s',
							}}
						>
							<Avatar
								icon={<UserOutlined />}
								size="small"
								style={{ backgroundColor: token.colorPrimary }}
							/>
							<Text
								style={{
									fontSize: '0.875rem',
									color: token.colorText,
									whiteSpace: 'nowrap',
								}}
							>
								{user?.name}
							</Text>
						</Flex>
					</Dropdown>
				</Flex>
			</Header>

			{/* Sidebar and Content */}
			<Layout style={{ margin: '0.25rem 0.25rem' }}>
				{/* Sidebar */}
				<Sider
					trigger={null}
					collapsible
					collapsed={collapsed}
					breakpoint="lg"
					width={200}
					style={{ boxShadow: token.boxShadow, borderRadius: '10px' }}
				>
					<Flex vertical style={{ height: '100%' }}>
						<Link href="/schools" style={{ textDecoration: 'none' }}>
							<Flex vertical justify="space-between" align="center" style={{ padding: '1rem' }}>
								<Avatar
									size={60}
									src="https://img.freepik.com/premium-vector/university-college-school-crests-logo-emblem-vector-template_441059-1011.jpg?semt=ais_hybrid&w=740"
								/>
								<Text
									strong
									style={{
										fontSize: '1rem',
										whiteSpace: 'nowrap',
										opacity: collapsed ? 0 : 1,
										transform: collapsed ? 'translateY(-10px)' : 'translateY(0)',
										transition: 'opacity 0.3s ease, transform 0.3s ease',
										height: collapsed ? 0 : 'auto',
										overflow: 'hidden',
										margin: collapsed ? 0 : '0.5rem 0',
									}}
								>
									School Name
								</Text>
								<Divider style={{ margin: '0.5rem' }} />
							</Flex>
						</Link>

						<Flex vertical justify="space-between" style={{ height: '100%' }}>
							<Menu
								style={{
									border: 'none',
									display: 'flex',
									flexDirection: 'column',
									gap: '0.5rem',
								}}
								mode="inline"
								selectedKeys={[pathname.startsWith('/admin/') ? pathname : '/admin/students']}
								items={menuItems}
								// onClick={({ key }) => router.push(key)}
							/>
							<div style={{ padding: '0.5rem' }}>
								<TriggerButton collapsed={collapsed} setCollapsed={setCollapsed} />
							</div>
						</Flex>
					</Flex>
				</Sider>

				{/* Content */}
				<Content
					style={{
						padding: '1rem',
						height: 'calc(100vh - 4rem)',
						overflow: 'auto',
					}}
					className="custom-scrollbar"
				>
					{children}
				</Content>
			</Layout>
		</Layout>
	);
};

export default MainLayout;
