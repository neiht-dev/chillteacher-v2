import { Navigate } from "react-router";
import { useAuth } from "~/contexts/AuthContext";

const Logout = () => {
	const { logout } = useAuth();
	logout();
	return <Navigate to="/login" />;
};

export default Logout;
