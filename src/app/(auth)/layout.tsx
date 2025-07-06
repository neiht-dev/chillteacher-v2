'use client';

import { Flex, Layout } from 'antd';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<Layout>
			<Flex justify="center" vertical align="center" style={{ height: '100vh' }}>
				{children}
			</Flex>
		</Layout>
	);
};

export default AuthLayout;
