import { Navigate } from "react-router";
import LandingPage from "~/components/landing/LandingPage";
import { useAuth } from "~/contexts/AuthContext";

const Home = () => {
	const { isLoggedIn } = useAuth();
	return isLoggedIn ? <Navigate to="/dashboard" /> : <LandingPage />;
};

export default Home;
