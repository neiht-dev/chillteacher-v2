'use client';

import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
	const router = useRouter();

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '100vh',
				background: '#f5f5f5',
			}}
		>
			<Result
				status="403"
				title="403"
				subTitle="Sorry, you are not authorized to access this page."
				extra={[
					<Button type="primary" key="dashboard" onClick={() => router.push('/dashboard')}>
						Go to Dashboard
					</Button>,
					<Button key="back" onClick={() => router.back()}>
						Go Back
					</Button>,
				]}
			/>
		</div>
	);
}
