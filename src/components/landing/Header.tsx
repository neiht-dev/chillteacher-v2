'use client';

import {
	AppstoreOutlined,
	CloseOutlined,
	DollarOutlined,
	MenuOutlined,
	MessageOutlined,
	PhoneOutlined,
	QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, Divider, Drawer, Flex, Layout, Menu, Typography, theme } from 'antd';
import { useResponsive } from 'antd-style';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { ThemeLangControl } from '@/components/ui/ThemeLangControl';
import path from 'path';

const { Text } = Typography;

const navItems = [
	{
		label: 'Tính năng',
		key: '#features',
		href: '#features',
		icon: <AppstoreOutlined />,
	},
	{
		label: 'Giá cả',
		key: '#pricing',
		href: '#pricing',
		icon: <DollarOutlined />,
	},
	{
		label: 'Lời chứng thực',
		key: '#testimonials',
		href: '#testimonials',
		icon: <MessageOutlined />,
	},
	{
		label: 'Câu hỏi thường gặp',
		key: '#faq',
		href: '#faq',
		icon: <QuestionCircleOutlined />,
	},
	{
		label: 'Liên hệ',
		key: '#contact',
		href: '#contact',
		icon: <PhoneOutlined />,
	},
];

const CTA = () => {
	return (
		<>
			<Link href="/login" style={{ textDecoration: 'none' }}>
				<Button
					color="orange"
					variant="outlined"
					style={{
						fontWeight: 600,
					}}
				>
					Đăng nhập
				</Button>
			</Link>
			<Link href="/signup" style={{ textDecoration: 'none' }}>
				<Button type="primary" style={{ fontWeight: 600 }}>
					Đăng ký
				</Button>
			</Link>
		</>
	);
};

const DesktopNav = () => {
	const pathname = usePathname();
	return (
		<>
			<Flex align="center" gap={20}>
				{navItems.map((item) => (
					<Link key={item.key} href={item.key}>
						<Text
							style={{
								fontSize: '1rem',
								whiteSpace: 'nowrap',
								transition: 'opacity 0.3s ease, transform 0.3s ease',
								color: item.key === pathname ? '#1677ff' : '',
							}}
						>
							{item.label}
						</Text>
					</Link>
				))}
			</Flex>

			<Flex gap={16} align="center">
				<ThemeLangControl />
				<Divider type="vertical" style={{ height: '1.5rem', margin: '0' }} />
				<CTA />
			</Flex>
		</>
	);
};

const MobileNav = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	return (
		<Flex gap={16} align="center">
			<ThemeLangControl />
			<Divider type="vertical" style={{ height: '1.5rem', margin: '0' }} />
			<Button
				type="text"
				icon={isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
				onClick={() => setIsMenuOpen(!isMenuOpen)}
			/>
			<Drawer placement="right" open={isMenuOpen} onClose={() => setIsMenuOpen(false)} width={260}>
				<Menu
					style={{
						border: 'none',
						display: 'flex',
						flexDirection: 'column',
						gap: '0.5rem',
					}}
					mode="inline"
					selectedKeys={[pathname]}
					items={navItems}
					onClick={({ key }) => router.push(key)}
				/>
				<Divider />
				<Flex gap={16} align="center">
					<CTA />
				</Flex>
			</Drawer>
		</Flex>
	);
};

const Header = () => {
	const { token } = theme.useToken();
	const { lg } = useResponsive();

	return (
		<Layout.Header
			style={{
				height: '4rem',
				boxShadow: token.boxShadow,
				zIndex: 1,
				padding: '0 1rem',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				whiteSpace: 'nowrap',
				position: 'sticky',
				top: 0,
			}}
		>
			<Logo />

			{/* Desktop Navigation */}
			{lg ? <DesktopNav /> : <MobileNav />}
		</Layout.Header>
	);
};

export default Header;
