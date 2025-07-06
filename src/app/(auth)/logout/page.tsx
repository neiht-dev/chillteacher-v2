'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Spin } from 'antd';

const Logout = () => {
	const { logout } = useAuth();
	const router = useRouter();

	useEffect(() => {
		logout();
		router.push('/login');
	}, [logout, router]);

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				background: '#f8fafc',
			}}
		>
			<Spin size="large" />
		</div>
	);
};

export default Logout;
