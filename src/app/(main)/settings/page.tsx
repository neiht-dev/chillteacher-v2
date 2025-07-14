'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
	BellOutlined,
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
	SaveOutlined,
	SecurityScanOutlined,
	SettingOutlined,
	TeamOutlined,
	UploadOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {
	Avatar,
	Button,
	Card,
	Col,
	Divider,
	Form,
	Input,
	Modal,
	Row,
	Select,
	Space,
	Switch,
	Table,
	Tabs,
	Tag,
	Typography,
	Upload,
	App as AntApp,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type React from 'react';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface UserRole {
	key: string;
	name: string;
	permissions: string[];
	userCount: number;
	status: 'active' | 'inactive';
}

const Settings: React.FC = () => {
	const { message } = AntApp.useApp();
	const [form] = Form.useForm();
	const [userForm] = Form.useForm();
	const [isUserModalOpen, setIsUserModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<any>(null);

	// Mock data for user roles
	const [userRoles, setUserRoles] = useState<UserRole[]>([
		{
			key: '1',
			name: 'Administrator',
			permissions: ['all'],
			userCount: 2,
			status: 'active',
		},
		{
			key: '2',
			name: 'Teacher',
			permissions: ['view_students', 'manage_attendance', 'view_reports'],
			userCount: 15,
			status: 'active',
		},
		{
			key: '3',
			name: 'Student',
			permissions: ['view_profile', 'view_grades'],
			userCount: 1245,
			status: 'active',
		},
		{
			key: '4',
			name: 'Parent',
			permissions: ['view_child_profile', 'view_child_grades', 'view_attendance'],
			userCount: 890,
			status: 'active',
		},
	]);

	const mockUsers = [
		{
			key: '1',
			name: 'John Admin',
			email: 'admin@school.com',
			role: 'Administrator',
			status: 'active',
			lastLogin: '2024-01-26 09:30',
		},
		{
			key: '2',
			name: 'Dr. Sarah Wilson',
			email: 'sarah.wilson@school.com',
			role: 'Teacher',
			status: 'active',
			lastLogin: '2024-01-26 08:45',
		},
		{
			key: '3',
			name: 'Alice Johnson',
			email: 'alice.johnson@email.com',
			role: 'Student',
			status: 'active',
			lastLogin: '2024-01-25 16:20',
		},
	];

	const handleSaveSettings = (values: any) => {
		console.log('Settings saved:', values);
		message.success('Settings saved successfully');
	};

	const handleAddUser = () => {
		setSelectedUser(null);
		userForm.resetFields();
		setIsUserModalOpen(true);
	};

	const handleEditUser = (user: any) => {
		setSelectedUser(user);
		userForm.setFieldsValue(user);
		setIsUserModalOpen(true);
	};

	const handleDeleteUser = (userId: string) => {
		Modal.confirm({
			title: 'Are you sure you want to delete this user?',
			content: 'This action cannot be undone.',
			okText: 'Yes, Delete',
			okType: 'danger',
			cancelText: 'Cancel',
			onOk: () => {
				message.success('User deleted successfully');
			},
		});
	};

	const handleUserModalOk = () => {
		userForm.validateFields().then((values) => {
			if (selectedUser) {
				message.success('User updated successfully');
			} else {
				message.success('User added successfully');
			}
			setIsUserModalOpen(false);
			userForm.resetFields();
		});
	};

	const userColumns: ColumnsType<any> = [
		{
			title: 'User',
			dataIndex: 'name',
			key: 'name',
			render: (_, record) => (
				<div>
					<Text strong>{record.name}</Text>
					<br />
					<Text type="secondary">{record.email}</Text>
				</div>
			),
		},
		{
			title: 'Role',
			dataIndex: 'role',
			key: 'role',
			render: (text) => <Tag color="blue">{text}</Tag>,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (text) => <Tag color={text === 'active' ? 'green' : 'red'}>{text.toUpperCase()}</Tag>,
		},
		{
			title: 'Last Login',
			dataIndex: 'lastLogin',
			key: 'lastLogin',
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Button type="text" icon={<EditOutlined />} onClick={() => handleEditUser(record)} />
					<Button
						type="text"
						danger
						icon={<DeleteOutlined />}
						onClick={() => handleDeleteUser(record.key)}
					/>
				</Space>
			),
		},
	];

	const roleColumns: ColumnsType<UserRole> = [
		{
			title: 'Role Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Users',
			dataIndex: 'userCount',
			key: 'userCount',
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (text) => <Tag color={text === 'active' ? 'green' : 'red'}>{text.toUpperCase()}</Tag>,
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Button type="text" icon={<EditOutlined />} />
					<Button type="text" danger icon={<DeleteOutlined />} />
				</Space>
			),
		},
	];

	return (
		<div>
			<div style={{ marginBottom: 24 }}>
				<Title level={2}>Settings</Title>
				<Text type="secondary">Manage system configuration, user roles, and preferences</Text>
			</div>

			<Tabs defaultActiveKey="general">
				<TabPane
					tab={
						<span>
							<SettingOutlined />
							General
						</span>
					}
					key="general"
				>
					<Row gutter={[16, 16]}>
						<Col xs={24} lg={12}>
							<Card title="School Information">
								<Form
									form={form}
									layout="vertical"
									onFinish={handleSaveSettings}
									initialValues={{
										schoolName: 'Greenwood High School',
										address: '123 Education Street, Learning City, LC 12345',
										phone: '+1 (555) 123-4567',
										email: 'info@greenwoodhigh.edu',
										website: 'www.greenwoodhigh.edu',
										principalName: 'Dr. Michael Johnson',
										establishedYear: '1985',
										studentCapacity: 1500,
									}}
								>
									<Form.Item
										name="schoolName"
										label="School Name"
										rules={[{ required: true, message: 'Please enter school name' }]}
									>
										<Input />
									</Form.Item>

									<Form.Item
										name="address"
										label="Address"
										rules={[{ required: true, message: 'Please enter address' }]}
									>
										<Input.TextArea rows={3} />
									</Form.Item>

									<Row gutter={16}>
										<Col span={12}>
											<Form.Item
												name="phone"
												label="Phone"
												rules={[{ required: true, message: 'Please enter phone' }]}
											>
												<Input />
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item
												name="email"
												label="Email"
												rules={[
													{ required: true, message: 'Please enter email' },
													{
														type: 'email',
														message: 'Please enter valid email',
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
									</Row>

									<Row gutter={16}>
										<Col span={12}>
											<Form.Item name="website" label="Website">
												<Input />
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item name="establishedYear" label="Established Year">
												<Input />
											</Form.Item>
										</Col>
									</Row>

									<Row gutter={16}>
										<Col span={12}>
											<Form.Item name="principalName" label="Principal Name">
												<Input />
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item name="studentCapacity" label="Student Capacity">
												<Input type="number" />
											</Form.Item>
										</Col>
									</Row>

									<Form.Item>
										<Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
											Save Changes
										</Button>
									</Form.Item>
								</Form>
							</Card>
						</Col>

						<Col xs={24} lg={12}>
							<Card title="School Logo">
								<div style={{ textAlign: 'center', marginBottom: 24 }}>
									<Avatar
										size={120}
										icon={<UserOutlined />}
										style={{ backgroundColor: '#1890ff' }}
									/>
								</div>
								<Upload name="logo" listType="picture" maxCount={1} beforeUpload={() => false}>
									<Button icon={<UploadOutlined />} block>
										Upload New Logo
									</Button>
								</Upload>
								<Text
									type="secondary"
									style={{
										display: 'block',
										marginTop: 8,
										textAlign: 'center',
									}}
								>
									Recommended size: 200x200px, Max size: 2MB
								</Text>
							</Card>

							<Card title="Academic Year Settings" style={{ marginTop: 16 }}>
								<Form layout="vertical">
									<Form.Item label="Current Academic Year">
										<Select defaultValue="2023-2024">
											<Option value="2023-2024">2023-2024</Option>
											<Option value="2024-2025">2024-2025</Option>
										</Select>
									</Form.Item>

									<Form.Item label="Semester System">
										<Select defaultValue="2-semester">
											<Option value="2-semester">2 Semester</Option>
											<Option value="3-trimester">3 Trimester</Option>
											<Option value="4-quarter">4 Quarter</Option>
										</Select>
									</Form.Item>

									<Form.Item label="Grading System">
										<Select defaultValue="letter">
											<Option value="letter">Letter Grades (A-F)</Option>
											<Option value="percentage">Percentage (0-100)</Option>
											<Option value="gpa">GPA (0-4.0)</Option>
										</Select>
									</Form.Item>
								</Form>
							</Card>
						</Col>
					</Row>
				</TabPane>

				<TabPane
					tab={
						<span>
							<BellOutlined />
							Notifications
						</span>
					}
					key="notifications"
				>
					<Card title="Notification Settings">
						<Form layout="vertical">
							<Title level={4}>Email Notifications</Title>
							<Row gutter={[16, 16]}>
								<Col span={12}>
									<Form.Item label="Student Attendance Alerts">
										<Switch defaultChecked />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Grade Updates">
										<Switch defaultChecked />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Assignment Due Dates">
										<Switch defaultChecked />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Fee Payment Reminders">
										<Switch defaultChecked />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Event Announcements">
										<Switch />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="System Maintenance">
										<Switch defaultChecked />
									</Form.Item>
								</Col>
							</Row>

							<Divider />

							<Title level={4}>SMS Notifications</Title>
							<Row gutter={[16, 16]}>
								<Col span={12}>
									<Form.Item label="Emergency Alerts">
										<Switch defaultChecked />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Absence Notifications">
										<Switch defaultChecked />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Event Reminders">
										<Switch />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Fee Due Alerts">
										<Switch defaultChecked />
									</Form.Item>
								</Col>
							</Row>

							<Divider />

							<Button type="primary" icon={<SaveOutlined />}>
								Save Notification Settings
							</Button>
						</Form>
					</Card>
				</TabPane>

				<TabPane
					tab={
						<span>
							<SecurityScanOutlined />
							Security
						</span>
					}
					key="security"
				>
					<Row gutter={[16, 16]}>
						<Col xs={24} lg={12}>
							<Card title="Password Policy">
								<Form layout="vertical">
									<Form.Item label="Minimum Password Length">
										<Select defaultValue="8">
											<Option value="6">6 characters</Option>
											<Option value="8">8 characters</Option>
											<Option value="10">10 characters</Option>
											<Option value="12">12 characters</Option>
										</Select>
									</Form.Item>

									<Form.Item label="Password Requirements">
										<div>
											<div style={{ marginBottom: 8 }}>
												<Switch defaultChecked /> Require uppercase letters
											</div>
											<div style={{ marginBottom: 8 }}>
												<Switch defaultChecked /> Require lowercase letters
											</div>
											<div style={{ marginBottom: 8 }}>
												<Switch defaultChecked /> Require numbers
											</div>
											<div style={{ marginBottom: 8 }}>
												<Switch /> Require special characters
											</div>
										</div>
									</Form.Item>

									<Form.Item label="Password Expiry">
										<Select defaultValue="90">
											<Option value="30">30 days</Option>
											<Option value="60">60 days</Option>
											<Option value="90">90 days</Option>
											<Option value="never">Never</Option>
										</Select>
									</Form.Item>
								</Form>
							</Card>
						</Col>

						<Col xs={24} lg={12}>
							<Card title="Login Security">
								<Form layout="vertical">
									<Form.Item label="Session Timeout">
										<Select defaultValue="30">
											<Option value="15">15 minutes</Option>
											<Option value="30">30 minutes</Option>
											<Option value="60">1 hour</Option>
											<Option value="120">2 hours</Option>
										</Select>
									</Form.Item>

									<Form.Item label="Failed Login Attempts">
										<Select defaultValue="5">
											<Option value="3">3 attempts</Option>
											<Option value="5">5 attempts</Option>
											<Option value="10">10 attempts</Option>
										</Select>
									</Form.Item>

									<Form.Item label="Account Lockout Duration">
										<Select defaultValue="15">
											<Option value="5">5 minutes</Option>
											<Option value="15">15 minutes</Option>
											<Option value="30">30 minutes</Option>
											<Option value="60">1 hour</Option>
										</Select>
									</Form.Item>

									<Form.Item label="Two-Factor Authentication">
										<Switch /> Enable 2FA for all users
									</Form.Item>
								</Form>
							</Card>
						</Col>
					</Row>

					<Card title="Data Backup" style={{ marginTop: 16 }}>
						<Row gutter={16}>
							<Col span={12}>
								<Form layout="vertical">
									<Form.Item label="Automatic Backup">
										<Switch defaultChecked />
									</Form.Item>
									<Form.Item label="Backup Frequency">
										<Select defaultValue="daily">
											<Option value="hourly">Hourly</Option>
											<Option value="daily">Daily</Option>
											<Option value="weekly">Weekly</Option>
										</Select>
									</Form.Item>
									<Form.Item label="Backup Retention">
										<Select defaultValue="30">
											<Option value="7">7 days</Option>
											<Option value="30">30 days</Option>
											<Option value="90">90 days</Option>
											<Option value="365">1 year</Option>
										</Select>
									</Form.Item>
								</Form>
							</Col>
							<Col span={12}>
								<div
									style={{
										padding: 16,
										background: '#f5f5f5',
										borderRadius: 8,
									}}
								>
									<Text strong>Last Backup:</Text>
									<br />
									<Text>January 26, 2024 at 2:00 AM</Text>
									<br />
									<Text strong>Status:</Text>
									<br />
									<Tag color="green">Successful</Tag>
									<br />
									<Button type="primary" style={{ marginTop: 16 }}>
										Create Backup Now
									</Button>
								</div>
							</Col>
						</Row>
					</Card>
				</TabPane>

				<TabPane
					tab={
						<span>
							<TeamOutlined />
							User Management
						</span>
					}
					key="users"
				>
					<Card
						title="User Accounts"
						extra={
							<Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
								Add User
							</Button>
						}
					>
						<Table
							columns={userColumns}
							dataSource={mockUsers}
							pagination={{
								pageSize: 10,
								showSizeChanger: true,
								showQuickJumper: true,
							}}
						/>
					</Card>

					<Card title="User Roles" style={{ marginTop: 16 }}>
						<Table columns={roleColumns} dataSource={userRoles} pagination={false} />
					</Card>
				</TabPane>
			</Tabs>

			{/* Add/Edit User Modal */}
			<Modal
				title={selectedUser ? 'Edit User' : 'Add New User'}
				open={isUserModalOpen}
				onOk={handleUserModalOk}
				onCancel={() => setIsUserModalOpen(false)}
				width={600}
			>
				<Form form={userForm} layout="vertical">
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="name"
								label="Full Name"
								rules={[{ required: true, message: 'Please enter name' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="email"
								label="Email"
								rules={[
									{ required: true, message: 'Please enter email' },
									{ type: 'email', message: 'Please enter valid email' },
								]}
							>
								<Input />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="role"
								label="Role"
								rules={[{ required: true, message: 'Please select role' }]}
							>
								<Select>
									<Option value="Administrator">Administrator</Option>
									<Option value="Teacher">Teacher</Option>
									<Option value="Student">Student</Option>
									<Option value="Parent">Parent</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="status"
								label="Status"
								rules={[{ required: true, message: 'Please select status' }]}
							>
								<Select>
									<Option value="active">Active</Option>
									<Option value="inactive">Inactive</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>

					{!selectedUser && (
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name="password"
									label="Password"
									rules={[{ required: true, message: 'Please enter password' }]}
								>
									<Input.Password />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name="confirmPassword"
									label="Confirm Password"
									rules={[
										{ required: true, message: 'Please confirm password' },
										({ getFieldValue }) => ({
											validator(_, value) {
												if (!value || getFieldValue('password') === value) {
													return Promise.resolve();
												}
												return Promise.reject(new Error('Passwords do not match'));
											},
										}),
									]}
								>
									<Input.Password />
								</Form.Item>
							</Col>
						</Row>
					)}
				</Form>
			</Modal>
		</div>
	);
};

export default Settings;
