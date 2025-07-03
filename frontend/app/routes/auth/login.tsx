import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router";
import { Logo } from "~/components/UI/Logo";
import { ThemeLangControl } from "~/components/UI/ThemeLangControl";
import { useAuth } from "~/contexts/AuthContext";
import { useLang } from "~/contexts/LangContext";

const LoginPage = () => {
	const navigate = useNavigate();
	const { login, isLoading } = useAuth();
	const { t } = useLang();

	const handleSubmit = async (values: { email: string; password: string }) => {
		try {
			await login(values.email, values.password);
			navigate("/");
		} catch (_error) {
			message.error(t("Invalid email or password"));
		}
	};

	return (
		<Card
			style={{
				width: "100%",
				maxWidth: 400,
				margin: "0 auto",
				boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
			}}
		>
			<div style={{ textAlign: "center", marginBottom: 32 }}>
				<Logo />
				<p style={{ color: "#64748b", marginTop: 8 }}>
					{t("Login to your account")}
				</p>
			</div>

			<Form name="login" onFinish={handleSubmit} layout="vertical" size="large">
				<Form.Item
					label={t("Email")}
					name="email"
					rules={[
						{ required: true, message: t("Please enter your email") },
						{ type: "email", message: t("Please enter a valid email") },
					]}
				>
					<Input
						prefix={<UserOutlined />}
						placeholder={t("Enter your email")}
					/>
				</Form.Item>

				<Form.Item
					label={t("Password")}
					name="password"
					rules={[
						{ required: true, message: t("Please enter your password") },
						{ min: 6, message: t("Password must be at least 6 characters") },
					]}
				>
					<Input.Password
						prefix={<LockOutlined />}
						placeholder={t("Enter your password")}
					/>
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						loading={isLoading}
						style={{
							width: "100%",
							height: 48,
						}}
					>
						{t("Login")}
					</Button>
				</Form.Item>
			</Form>

			<div style={{ textAlign: "center" }}>
				<span style={{ color: "#64748b" /* gray-600 */ }}>
					{t("Don't have an account?")}{" "}
				</span>
				<Link
					to="/signup"
					style={{
						color: "#3b82f6", // blue-600
						fontWeight: 500,
						textDecoration: "none",
					}}
				>
					{t("Sign up here")}
				</Link>
			</div>
			<div style={{ marginTop: 16 }}>
				<ThemeLangControl />
			</div>
		</Card>
	);
};

export default LoginPage;
