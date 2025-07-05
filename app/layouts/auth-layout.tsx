import { Flex, Layout } from "antd";
import { Outlet } from "react-router";

const AuthLayout = () => {
	return (
		<Layout>
			<Flex
				justify="center"
				vertical
				align="center"
				style={{ height: "100vh" }}
			>
				<Outlet />
			</Flex>
		</Layout>
	);
};

export default AuthLayout;
