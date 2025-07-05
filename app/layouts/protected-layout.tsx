import { Navigate, Outlet } from "react-router";
import { useAuth } from "~/contexts/AuthContext";

const ProtectedLayout = () => {
	const { user } = useAuth();
	if (!user) {
		console.log("User is not logged in - redirecting to login");
		return <Navigate to="/login" />;
	}

	return <Outlet />;
};

export default ProtectedLayout;
