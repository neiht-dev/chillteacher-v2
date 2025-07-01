import { Typography, theme } from "antd";

const { Text } = Typography;
// Define the Logo component
export const Logo = () => {
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
