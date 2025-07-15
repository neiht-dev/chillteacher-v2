'use client';

import {
	DatabaseOutlined,
	TeamOutlined,
	BookOutlined,
	UserOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Typography, Space, Button } from 'antd';
import Link from 'next/link';

const { Title, Text } = Typography;

interface TableInfo {
	name: string;
	displayName: string;
	description: string;
	icon: React.ReactNode;
	route: string;
	recordCount?: number;
}

const tables: TableInfo[] = [
	{
		name: 'users',
		displayName: 'Người dùng',
		description: 'Quản lý tất cả người dùng trong hệ thống',
		icon: <UserOutlined style={{ fontSize: '24px' }} />,
		route: '/admin/users',
	},
	{
		name: 'courses',
		displayName: 'Khóa học',
		description: 'Quản lý các khóa học và môn học',
		icon: <BookOutlined style={{ fontSize: '24px' }} />,
		route: '/admin/courses',
	},
	{
		name: 'classes',
		displayName: 'Lớp học',
		description: 'Quản lý các lớp học và lịch học',
		icon: <TeamOutlined style={{ fontSize: '24px' }} />,
		route: '/admin/classes',
	},
	{
		name: 'enrollments',
		displayName: 'Đăng ký học',
		description: 'Quản lý việc đăng ký học của sinh viên',
		icon: <DatabaseOutlined style={{ fontSize: '24px' }} />,
		route: '/admin/enrollments',
	},
];

export default function AdminPage() {
	return (
		<div style={{ padding: '24px' }}>
			<Space direction="vertical" size="large" style={{ width: '100%' }}>
				<div>
					<Title level={2}>
						<SettingOutlined style={{ marginRight: '8px' }} />
						Quản lý Database
					</Title>
					<Text type="secondary">Chọn bảng để quản lý dữ liệu CRUD</Text>
				</div>

				<Row gutter={[16, 16]}>
					{tables.map((table) => (
						<Col xs={24} sm={12} lg={8} xl={6} key={table.name}>
							<Link href={table.route} style={{ textDecoration: 'none' }}>
								<Card hoverable style={{ height: '100%' }} bodyStyle={{ padding: '24px' }}>
									<Space direction="vertical" size="middle" style={{ width: '100%' }}>
										<div style={{ textAlign: 'center' }}>{table.icon}</div>
										<div>
											<Title level={4} style={{ margin: 0, textAlign: 'center' }}>
												{table.displayName}
											</Title>
											<Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
												{table.description}
											</Text>
										</div>
										<Button type="primary" block>
											Quản lý {table.displayName}
										</Button>
									</Space>
								</Card>
							</Link>
						</Col>
					))}
				</Row>
			</Space>
		</div>
	);
}
