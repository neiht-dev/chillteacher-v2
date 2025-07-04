import {
	CalendarOutlined,
	ClockCircleOutlined,
	DownloadOutlined,
	EnvironmentOutlined,
	MailOutlined,
	PhoneOutlined,
} from "@ant-design/icons";
import {
	Button,
	Card,
	Col,
	Flex,
	Form,
	Input,
	Row,
	Select,
	Typography,
	theme,
} from "antd";

const { Title, Paragraph } = Typography;

const Contact = () => {
	const { token } = theme.useToken();
	return (
		<section
			id="contact"
			style={{
				padding: `${token.paddingXL * 2}px 0`,
				background: token.colorBgContainer,
			}}
		>
			<div
				style={{
					maxWidth: 1200,
					margin: "0 auto",
					padding: `0 ${token.paddingLG}px`,
				}}
			>
				<div style={{ textAlign: "center", marginBottom: token.marginXL * 2 }}>
					<Title
						level={2}
						style={{
							fontWeight: token.fontWeightStrong,
							fontSize: 36,
							color: token.colorTextHeading,
							marginBottom: token.marginLG,
						}}
					>
						Liên lạc
					</Title>
					<Paragraph
						style={{
							fontSize: 20,
							color: token.colorTextDescription,
							maxWidth: 700,
							margin: "0 auto",
						}}
					>
						Sẵn sàng thay đổi trải nghiệm giảng dạy của bạn? Chúng tôi rất muốn
						nghe từ bạn. Hãy liên hệ với chúng tôi và cùng nhau làm cho việc
						giảng dạy trở nên thú vị hơn.
					</Paragraph>
				</div>
				<Row gutter={[token.marginXL, token.marginXL]}>
					{/* Contact Form */}
					<Col xs={24} lg={12}>
						<Card
							style={{
								background: token.colorBgLayout,
								borderRadius: token.borderRadiusXL,
							}}
							bodyStyle={{ padding: token.paddingXL }}
						>
							<Title
								level={3}
								style={{
									fontWeight: token.fontWeightStrong,
									fontSize: 24,
									color: token.colorTextHeading,
									marginBottom: token.marginLG,
								}}
							>
								Gửi tin nhắn cho chúng tôi
							</Title>
							<Form layout="vertical">
								<Row gutter={token.margin}>
									<Col xs={24} md={12}>
										<Form.Item label="Tên" name="firstName">
											<Input
												placeholder="John"
												size="large"
												style={{ borderRadius: token.borderRadius }}
											/>
										</Form.Item>
									</Col>
									<Col xs={24} md={12}>
										<Form.Item label="Họ" name="lastName">
											<Input
												placeholder="Smith"
												size="large"
												style={{ borderRadius: token.borderRadius }}
											/>
										</Form.Item>
									</Col>
								</Row>
								<Form.Item label="Địa chỉ email" name="email">
									<Input
										type="email"
										placeholder="john.smith@school.edu"
										size="large"
										style={{ borderRadius: token.borderRadius }}
									/>
								</Form.Item>
								<Form.Item label="Chủ đề" name="subject">
									<Select
										placeholder="Chọn một chủ đề"
										size="large"
										style={{ borderRadius: token.borderRadius }}
									>
										<Select.Option value="sales">
											Yêu cầu bán hàng
										</Select.Option>
										<Select.Option value="support">
											Hỗ trợ kỹ thuật
										</Select.Option>
										<Select.Option value="demo">Yêu cầu Demo</Select.Option>
										<Select.Option value="partnership">
											Quan hệ đối tác
										</Select.Option>
										<Select.Option value="other">Khác</Select.Option>
									</Select>
								</Form.Item>
								<Form.Item label="Tin nhắn" name="message">
									<Input.TextArea
										rows={4}
										placeholder="Hãy cho chúng tôi biết chúng tôi có thể giúp bạn như thế nào..."
										style={{ borderRadius: token.borderRadius }}
									/>
								</Form.Item>
								<Form.Item>
									<Button
										type="primary"
										htmlType="submit"
										size="large"
										style={{
											borderRadius: token.borderRadiusLG,
											fontWeight: token.fontWeightStrong,
											width: "100%",
										}}
									>
										Gửi tin nhắn
									</Button>
								</Form.Item>
							</Form>
						</Card>
					</Col>
					{/* Contact Information */}
					<Col xs={24} lg={12}>
						<Flex vertical gap={token.marginXL}>
							<Card
								style={{ borderRadius: token.borderRadiusXL }}
								bodyStyle={{ padding: token.paddingXL }}
							>
								<Title
									level={3}
									style={{
										fontWeight: token.fontWeightStrong,
										fontSize: 24,
										color: token.colorTextHeading,
										marginBottom: token.marginLG,
									}}
								>
									Hãy kết nối
								</Title>
								<Paragraph
									style={{
										color: token.colorTextDescription,
										fontSize: 16,
										marginBottom: token.marginXL,
									}}
								>
									Chúng tôi ở đây để giúp bạn thành công. Cho dù bạn có câu hỏi
									về nền tảng của chúng tôi, cần hỗ trợ kỹ thuật hay muốn khám
									phá các cơ hội hợp tác, chúng tôi rất muốn nghe từ bạn.
								</Paragraph>
								<Flex vertical gap={token.marginLG}>
									<Flex align="start" gap={token.marginSM}>
										<MailOutlined
											style={{ fontSize: 24, color: token.colorPrimary }}
										/>
										<div>
											<div
												style={{
													fontWeight: token.fontWeightStrong,
													color: token.colorTextHeading,
													marginBottom: 4,
												}}
											>
												Gửi email cho chúng tôi
											</div>
											<div style={{ color: token.colorTextDescription }}>
												support@chillteacher.com
											</div>
											<div style={{ color: token.colorTextDescription }}>
												sales@chillteacher.com
											</div>
										</div>
									</Flex>
									<Flex align="start" gap={token.marginSM}>
										<PhoneOutlined
											style={{ fontSize: 24, color: token.colorSuccess }}
										/>
										<div>
											<div
												style={{
													fontWeight: token.fontWeightStrong,
													color: token.colorTextHeading,
													marginBottom: 4,
												}}
											>
												Gọi cho chúng tôi
											</div>
											<div style={{ color: token.colorTextDescription }}>
												1-800-CHILL-ED
											</div>
											<div style={{ color: token.colorTextDescription }}>
												(1-800-244-5533)
											</div>
										</div>
									</Flex>
									<Flex align="start" gap={token.marginSM}>
										<EnvironmentOutlined
											style={{ fontSize: 24, color: token.colorInfo }}
										/>
										<div>
											<div
												style={{
													fontWeight: token.fontWeightStrong,
													color: token.colorTextHeading,
													marginBottom: 4,
												}}
											>
												Ghé thăm chúng tôi
											</div>
											<div style={{ color: token.colorTextDescription }}>
												123 Education Street
											</div>
											<div style={{ color: token.colorTextDescription }}>
												San Francisco, CA 94102
											</div>
										</div>
									</Flex>
									<Flex align="start" gap={token.marginSM}>
										<ClockCircleOutlined
											style={{ fontSize: 24, color: token.colorWarning }}
										/>
										<div>
											<div
												style={{
													fontWeight: token.fontWeightStrong,
													color: token.colorTextHeading,
													marginBottom: 4,
												}}
											>
												Giờ hỗ trợ
											</div>
											<div style={{ color: token.colorTextDescription }}>
												Thứ Hai - Thứ Sáu: 6 giờ sáng - 6 giờ tối theo giờ PST
											</div>
											<div style={{ color: token.colorTextDescription }}>
												Thứ Bảy: 8 giờ sáng - 4 giờ chiều theo giờ PST
											</div>
										</div>
									</Flex>
								</Flex>
							</Card>
							<Card
								style={{
									background: token.colorBgLayout,
									borderRadius: token.borderRadiusXL,
								}}
								bodyStyle={{ padding: token.paddingXL }}
							>
								<div
									style={{
										fontWeight: token.fontWeightStrong,
										color: token.colorTextHeading,
										marginBottom: token.margin,
										fontSize: 18,
									}}
								>
									Hành động nhanh
								</div>
								<Flex vertical gap={token.marginSM}>
									<Button
										block
										icon={<CalendarOutlined />}
										style={{
											textAlign: "left",
											borderRadius: token.borderRadius,
										}}
									>
										Lên lịch Demo
									</Button>
									<Button
										block
										icon={<DownloadOutlined />}
										style={{
											textAlign: "left",
											borderRadius: token.borderRadius,
										}}
									>
										Tải xuống tài nguyên miễn phí
									</Button>
								</Flex>
							</Card>
						</Flex>
					</Col>
				</Row>
			</div>
		</section>
	);
};

export default Contact;
