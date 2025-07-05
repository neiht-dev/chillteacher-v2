import {
	FacebookFilled,
	InstagramOutlined,
	LinkedinOutlined,
	SmileOutlined,
	TwitterOutlined,
	YoutubeFilled,
} from "@ant-design/icons";
import { Col, Flex, Row, Typography, theme } from "antd";

const { Paragraph } = Typography;

const Footer = () => {
	const { token } = theme.useToken();
	return (
		<footer style={{ background: token.colorBgLayout, color: token.colorText }}>
			<div
				style={{
					maxWidth: 1200,
					margin: "0 auto",
					padding: `${token.paddingXL * 2}px ${token.paddingLG}px`,
				}}
			>
				<Row gutter={[token.marginXL, token.marginXL]}>
					{/* Company Info */}
					<Col xs={24} md={12} lg={6}>
						<Flex
							align="center"
							gap={token.marginSM}
							style={{ marginBottom: token.margin }}
						>
							<SmileOutlined
								style={{ fontSize: 32, color: token.colorPrimary }}
							/>
							<span
								style={{ fontSize: 28, fontWeight: token.fontWeightStrong }}
							>
								ChillTeacher
							</span>
						</Flex>
						<Paragraph
							style={{
								color: token.colorTextDescription,
								fontSize: 16,
								marginBottom: token.marginLG,
							}}
						>
							Trao quyền cho các nhà giáo dục bằng các công cụ sáng tạo để tạo
							ra trải nghiệm học tập hấp dẫn, hiệu quả đồng thời tiết kiệm thời
							gian và giảm căng thẳng.
						</Paragraph>
						<Flex gap={token.marginSM}>
							<FacebookFilled
								style={{
									fontSize: 24,
									color: token.colorTextDescription,
									cursor: "pointer",
								}}
							/>
							<TwitterOutlined
								style={{
									fontSize: 24,
									color: token.colorTextDescription,
									cursor: "pointer",
								}}
							/>
							<InstagramOutlined
								style={{
									fontSize: 24,
									color: token.colorTextDescription,
									cursor: "pointer",
								}}
							/>
							<LinkedinOutlined
								style={{
									fontSize: 24,
									color: token.colorTextDescription,
									cursor: "pointer",
								}}
							/>
							<YoutubeFilled
								style={{
									fontSize: 24,
									color: token.colorTextDescription,
									cursor: "pointer",
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
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Tính năng
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Giá cả
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Dùng thử miễn phí
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Ứng dụng di động
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								API
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Tích hợp
							</a>
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
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Trung tâm trợ giúp
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Blog
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Hội thảo trên web
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Mẫu
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Cộng đồng
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Nghiên cứu điển hình
							</a>
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
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Về chúng tôi
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Nghề nghiệp
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Báo chí
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Đối tác
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Liên hệ
							</a>
							<a
								href="/"
								style={{
									color: token.colorTextDescription,
									textDecoration: "none",
								}}
							>
								Trạng thái
							</a>
						</Flex>
					</Col>
				</Row>
				<div
					style={{
						borderTop: `1px solid ${token.colorBorder}`,
						marginTop: token.marginXL * 2,
						paddingTop: token.marginXL,
						textAlign: "center",
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
