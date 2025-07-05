import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Card, Collapse, Typography, theme } from "antd";

const { Title, Paragraph } = Typography;

const faqs = [
	{
		question: "Bản dùng thử miễn phí hoạt động như thế nào?",
		answer:
			"Bạn có toàn quyền truy cập vào tất cả các tính năng Chuyên nghiệp trong 14 ngày. Không cần thẻ tín dụng để bắt đầu. Sau khi dùng thử, bạn có thể chọn đăng ký hoặc tiếp tục với gói Starter miễn phí.",
	},
	{
		question: "Tôi có thể chuyển đổi gói bất cứ lúc nào không?",
		answer:
			"Chắc chắn rồi! Bạn có thể nâng cấp hoặc hạ cấp gói của mình bất cứ lúc nào. Các thay đổi có hiệu lực ngay lập tức và chúng tôi sẽ tính toán lại mọi điều chỉnh thanh toán.",
	},
	{
		question: "Dữ liệu của tôi có an toàn không?",
		answer:
			"Có, chúng tôi rất coi trọng vấn đề bảo mật. Tất cả dữ liệu được mã hóa khi truyền và khi lưu trữ. Chúng tôi tuân thủ FERPA và tuân theo các nguyên tắc bảo mật nghiêm ngặt đối với dữ liệu giáo dục.",
	},
	{
		question: "Bạn có giảm giá cho các trường học không?",
		answer:
			"Có! Chúng tôi cung cấp chiết khấu số lượng lớn cho các trường học và học khu. Liên hệ với nhóm bán hàng của chúng tôi để có giá tùy chỉnh dựa trên nhu cầu của bạn.",
	},
	{
		question: "Tôi có thể nhập dữ liệu hiện có của mình không?",
		answer:
			"Có, chúng tôi cung cấp hỗ trợ di chuyển miễn phí để giúp bạn nhập dữ liệu học sinh, kế hoạch bài học và các tài liệu khác hiện có của mình từ các nền tảng khác.",
	},
	{
		question: "Bạn cung cấp loại hỗ trợ nào?",
		answer:
			"Chúng tôi cung cấp hỗ trợ qua email cho tất cả người dùng, với hỗ trợ ưu tiên cho người đăng ký Chuyên nghiệp và hỗ trợ qua điện thoại chuyên dụng cho người dùng gói Trường học. Chúng tôi cũng có tài liệu và video hướng dẫn phong phú.",
	},
	{
		question: "ChillTeacher có hoạt động ngoại tuyến không?",
		answer:
			"Một số tính năng hoạt động ngoại tuyến thông qua ứng dụng di động của chúng tôi, bao gồm xem các bài học và flashcard đã tải xuống. Tuy nhiên, hầu hết các tính năng yêu cầu kết nối internet để có đầy đủ chức năng.",
	},
	{
		question: "Phụ huynh có thể truy cập vào sự tiến bộ của học sinh không?",
		answer:
			"Có, bạn có thể chia sẻ báo cáo tiến độ của học sinh với phụ huynh thông qua tính năng cổng thông tin dành cho phụ huynh của chúng tôi, có sẵn trên các gói Chuyên nghiệp và Trường học.",
	},
];

const FAQ = () => {
	const { token } = theme.useToken();
	return (
		<section
			id="faq"
			style={{
				padding: `${token.paddingXL * 2}px 0`,
				background: token.colorBgLayout,
			}}
		>
			<div
				style={{
					maxWidth: 900,
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
						<QuestionCircleOutlined
							style={{ color: token.colorPrimary, marginRight: 8 }}
						/>
						Các câu hỏi thường gặp
					</Title>
					<Paragraph
						style={{ fontSize: 20, color: token.colorTextDescription }}
					>
						Có câu hỏi? Chúng tôi có câu trả lời. Nếu bạn không thể tìm thấy
						những gì bạn đang tìm kiếm, vui lòng liên hệ với nhóm hỗ trợ của
						chúng tôi.
					</Paragraph>
				</div>
				<Collapse
					accordion
					bordered={false}
					style={{ background: "transparent" }}
					items={faqs.map((faq, index) => ({
						key: index,
						label: (
							<span style={{ fontWeight: 600, fontSize: 18 }}>
								{faq.question}
							</span>
						),
						children: (
							<Paragraph style={{ color: token.colorText, fontSize: 16 }}>
								{faq.answer}
							</Paragraph>
						),
						style: {
							background: token.colorBgContainer,
							borderRadius: token.borderRadiusLG,
							marginBottom: token.margin,
							boxShadow: token.boxShadowSecondary,
						},
					}))}
				/>
				<div style={{ marginTop: token.marginXL * 2, textAlign: "center" }}>
					<Card
						style={{
							background: token.colorPrimary,
							borderRadius: token.borderRadiusXL,
							padding: token.paddingXL * 2,
							color: token.colorWhite,
						}}
						bodyStyle={{ background: "transparent", color: token.colorWhite }}
					>
						<Title
							level={3}
							style={{ color: token.colorWhite, marginBottom: token.marginLG }}
						>
							Still have questions?
						</Title>
						<Paragraph
							style={{ color: token.colorInfoBg, marginBottom: token.marginXL }}
						>
							Our friendly support team is here to help you succeed.
						</Paragraph>
						<Button
							type="default"
							size="large"
							style={{
								borderRadius: token.borderRadiusLG,
								fontWeight: token.fontWeightStrong,
								background: token.colorWhite,
								color: token.colorPrimary,
							}}
						>
							Contact Support
						</Button>
					</Card>
				</div>
			</div>
		</section>
	);
};

export default FAQ;
