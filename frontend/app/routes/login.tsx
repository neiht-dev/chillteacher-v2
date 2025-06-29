import { useAuth } from "~/contexts/AuthContext";

const Login = () => {
	const { login } = useAuth();

	const handleLogin = () => {
		login("admin@example.com", "password");
	};

	return (
		<div>
			<h1>Login</h1>
			<button type="button" onClick={handleLogin}>
				Login
			</button>
		</div>
	);
};

export default Login;
