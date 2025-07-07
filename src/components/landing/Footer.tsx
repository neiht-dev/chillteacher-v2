'use client';

import {
	FacebookFilled,
	InstagramOutlined,
	LinkedinOutlined,
	SmileOutlined,
	TwitterOutlined,
	YoutubeFilled,
} from '@ant-design/icons';
import { Col, Flex, Row, Typography, theme } from 'antd';

import Link from 'next/link';

const { Paragraph } = Typography;

const Footer = () => {
	const { token } = theme.useToken();
	return (
		<footer style={{ background: token.colorBgLayout, color: token.colorText }}>
			<div
				style={{
					maxWidth: 1200,
					margin: '0 auto',
					padding: `${token.paddingXL * 2}px ${token.paddingLG}px`,
				}}
			>
				<Row gutter={[token.marginXL, token.marginXL]}>
					{/* Company Info */}
					<Col xs={24} md={12} lg={6}>
						<Flex align="center" gap={token.marginSM} style={{ marginBottom: token.margin }}>
							<SmileOutlined style={{ fontSize: 32, color: token.colorPrimary }} />
							<span style={{ fontSize: 28, fontWeight: token.fontWeightStrong }}>ChillTeacher</span>
						</Flex>
						<Paragraph
							style={{
								color: token.colorTextDescription,
								fontSize: 16,
								marginBottom: token.marginLG,
							}}
						>
							Trao quyền cho các nhà giáo dục bằng các công cụ sáng tạo để tạo ra trải nghiệm học
							tập hấp dẫn, hiệu quả đồng thời tiết kiệm thời gian và giảm căng thẳng.
						</Paragraph>
						<Flex gap={token.marginSM}>
							<FacebookFilled
								style={{
									fontSize: 24,
									color: token.colorTextDescription,
									cursor: 'pointer',
								}}
							/>
							<TwitterOutlined
								style={{
									fontSize: 24,
									color: token.colorTextDescription,
									cursor: 'pointer',
								}}
							/>
							<InstagramOutlined
								style={{
									fontSize: 24,
									color: token.colorTextDescription,
									cursor: 'pointer',
								}}
							/>
							<LinkedinOutlined
								style={{
									fontSize: 24,
									color: token.colorTextDescription,
									cursor: 'pointer',
								}}
							/>
							<YoutubeFilled
								style={{
									fontSize: 24,
									color: token.colorTextDescription,
									cursor: 'pointer',
								}}
							/>
						</Flex>
					</Col>
					{/* Sản phẩm */}
					<Col xs={24} md={12} lg={6}>
						<div
							style={{
								fontWeight: token.fontWeightStrong,
								fontSize: 18,
								marginBottom: token.margin,
							}}
						>
							Sản phẩm
						</div>
						<Flex vertical gap={token.marginSM}>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Tính năng
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Giá cả
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Dùng thử miễn phí
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Ứng dụng di động
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								API
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Tích hợp
							</Link>
						</Flex>
					</Col>
					{/* Tài nguyên */}
					<Col xs={24} md={12} lg={6}>
						<div
							style={{
								fontWeight: token.fontWeightStrong,
								fontSize: 18,
								marginBottom: token.margin,
							}}
						>
							Tài nguyên
						</div>
						<Flex vertical gap={token.marginSM}>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Trung tâm trợ giúp
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Blog
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Hội thảo trên web
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Mẫu
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Cộng đồng
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Nghiên cứu điển hình
							</Link>
						</Flex>
					</Col>
					{/* Company */}
					<Col xs={24} md={12} lg={6}>
						<div
							style={{
								fontWeight: token.fontWeightStrong,
								fontSize: 18,
								marginBottom: token.margin,
							}}
						>
							Công ty
						</div>
						<Flex vertical gap={token.marginSM}>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Về chúng tôi
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Nghề nghiệp
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Báo chí
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Đối tác
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Liên hệ
							</Link>
							<Link
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: 'none',
								}}
							>
								Trạng thái
							</Link>
						</Flex>
					</Col>
				</Row>
				<div
					style={{
						borderTop: `1px solid ${token.colorBorder}`,
						marginTop: token.marginXL * 2,
						paddingTop: token.marginXL,
						textAlign: 'center',
						color: token.colorTextDescription,
						fontSize: 14,
					}}
				>
					© {new Date().getFullYear()} ChillTeacher. All rights reserved.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
