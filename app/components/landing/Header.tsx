import {
	AppstoreOutlined,
	CloseOutlined,
	DollarOutlined,
	MenuOutlined,
	MessageOutlined,
	PhoneOutlined,
	QuestionCircleOutlined,
} from "@ant-design/icons";
import {
	Button,
	Divider,
	Drawer,
	Flex,
	Layout,
	Menu,
	Typography,
	theme,
} from "antd";
import { useResponsive } from "antd-style";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Logo } from "~/components/UI/Logo";
import { ThemeLangControl } from "~/components/UI/ThemeLangControl";

const { Text } = Typography;

const navItems = [
	{
		label: "Tính năng",
		key: "#features",
		href: "#features",
		icon: <AppstoreOutlined />,
	},
	{
		label: "Giá cả",
		key: "#pricing",
		href: "#pricing",
		icon: <DollarOutlined />,
	},
	{
		label: "Lời chứng thực",
		key: "#testimonials",
		href: "#testimonials",
		icon: <MessageOutlined />,
	},
	{
		label: "Câu hỏi thường gặp",
		key: "#faq",
		href: "#faq",
		icon: <QuestionCircleOutlined />,
	},
	{
		label: "Liên hệ",
		key: "#contact",
		href: "#contact",
		icon: <PhoneOutlined />,
	},
];

const DesktopNav = () => {
	return (
		<>
			<Flex align="center" gap={20}>
				{navItems.map((item) => (
					<Link key={item.key} to={item.key}>
						<Text
							style={{
								fontSize: "1rem",
								whiteSpace: "nowrap",
								transition: "opacity 0.3s ease, transform 0.3s ease",
								color: item.key === location.hash ? "#1677ff" : "",
							}}
						>
							{item.label}
						</Text>
					</Link>
				))}
			</Flex>

			<Flex gap={16} align="center">
				<ThemeLangControl />
				<Divider type="vertical" style={{ height: "1.5rem", margin: "0" }} />
				<Button
					color="orange"
					variant="outlined"
					href="/login"
					style={{
						borderRadius: 8,
						fontWeight: 600,
						background: "transparent",
					}}
				>
					Đăng nhập
				</Button>

				<Button
					type="primary"
					href="/signup"
					style={{ borderRadius: 8, fontWeight: 600 }}
				>
					Đăng ký
				</Button>
			</Flex>
		</>
	);
};

const MobileNav = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const navigate = useNavigate();
	return (
		<Flex gap={16} align="center">
			<ThemeLangControl />
			<Divider type="vertical" style={{ height: "1.5rem", margin: "0" }} />
			<Button
				type="text"
				icon={isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
				onClick={() => setIsMenuOpen(!isMenuOpen)}
			/>
			<Drawer
				placement="right"
				open={isMenuOpen}
				onClose={() => setIsMenuOpen(false)}
				width={260}
			>
				<Menu
					style={{
						border: "none",
						display: "flex",
						flexDirection: "column",
						gap: "0.5rem",
					}}
					mode="inline"
					selectedKeys={[location.pathname]}
					items={navItems}
					onClick={({ key }) => navigate(key)}
				/>
				<Divider />
				<Flex gap={16} align="center">
					<Button
						color="orange"
						variant="outlined"
						href="/login"
						style={{
							borderRadius: 8,
							fontWeight: 600,
							background: "transparent",
						}}
					>
						Đăng nhập
					</Button>

					<Button
						type="primary"
						href="/signup"
						style={{ borderRadius: 8, fontWeight: 600 }}
					>
						Đăng ký
					</Button>
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
				height: "4rem",
				boxShadow: token.boxShadow,
				zIndex: 1,
				padding: "0 1rem",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				whiteSpace: "nowrap",
				position: "sticky",
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
