'use client';

import {
	DeleteOutlined,
	DollarOutlined,
	EditOutlined,
	EyeOutlined,
	// HomeOutlined,
	MailOutlined,
	PhoneOutlined,
	PlusOutlined,
	SearchOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {
	Avatar,
	Button,
	Card,
	Col,
	DatePicker,
	Descriptions,
	Divider,
	Drawer,
	Form,
	Input,
	Modal,
	Row,
	Select,
	Space,
	Statistic,
	Table,
	Tag,
	Typography,
	App as AntApp,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type React from 'react';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

interface Student {
	key: string;
	id: string;
	name: string;
	email: string;
	phone: string;
	class: string;
	grade: string;
	status: 'active' | 'inactive' | 'graduated';
	enrollmentDate: string;
	avatar: string;
	address: string;
	parentName: string;
	parentPhone: string;
	tuitionFee: number;
	tuitionStatus: 'paid' | 'pending' | 'overdue';
}

const Students: React.FC = () => {
	const { message } = AntApp.useApp();
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [form] = Form.useForm();
	const [searchText, setSearchText] = useState('');
	const [selectedClass, setSelectedClass] = useState<string>('');
	const [selectedStatus, setSelectedStatus] = useState<string>('');

	// Mock data
	const [students, setStudents] = useState<Student[]>([
		{
			key: '1',
			id: 'STU001',
			name: 'Alice Johnson',
			email: 'alice.johnson@email.com',
			phone: '+1 234-567-8901',
			class: '10-A',
			grade: 'A',
			status: 'active',
			enrollmentDate: '2023-09-01',
			avatar:
				'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
			address: '123 Main St, City, State 12345',
			parentName: 'John Johnson',
			parentPhone: '+1 234-567-8900',
			tuitionFee: 5000,
			tuitionStatus: 'paid',
		},
		{
			key: '2',
			id: 'STU002',
			name: 'Bob Smith',
			email: 'bob.smith@email.com',
			phone: '+1 234-567-8902',
			class: '10-B',
			grade: 'B+',
			status: 'active',
			enrollmentDate: '2023-09-01',
			avatar:
				'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
			address: '456 Oak Ave, City, State 12345',
			parentName: 'Mary Smith',
			parentPhone: '+1 234-567-8903',
			tuitionFee: 5000,
			tuitionStatus: 'pending',
		},
		{
			key: '3',
			id: 'STU003',
			name: 'Carol Davis',
			email: 'carol.davis@email.com',
			phone: '+1 234-567-8904',
			class: '11-A',
			grade: 'A-',
			status: 'active',
			enrollmentDate: '2022-09-01',
			avatar:
				'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
			address: '789 Pine St, City, State 12345',
			parentName: 'Robert Davis',
			parentPhone: '+1 234-567-8905',
			tuitionFee: 5000,
			tuitionStatus: 'overdue',
		},
	]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'green';
			case 'inactive':
				return 'orange';
			case 'graduated':
				return 'blue';
			default:
				return 'default';
		}
	};

	const getTuitionStatusColor = (status: string) => {
		switch (status) {
			case 'paid':
				return 'green';
			case 'pending':
				return 'orange';
			case 'overdue':
				return 'red';
			default:
				return 'default';
		}
	};

	const handleAddStudent = () => {
		setSelectedStudent(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	const handleEditStudent = (student: Student) => {
		setSelectedStudent(student);
		form.setFieldsValue({
			...student,
			enrollmentDate: dayjs(student.enrollmentDate),
		});
		setIsModalOpen(true);
	};

	const handleViewStudent = (student: Student) => {
		setSelectedStudent(student);
		setIsDrawerOpen(true);
	};

	const handleDeleteStudent = (studentId: string) => {
		Modal.confirm({
			title: 'Are you sure you want to delete this student?',
			content: 'This action cannot be undone.',
			okText: 'Yes, Delete',
			okType: 'danger',
			cancelText: 'Cancel',
			onOk: () => {
				setStudents(students.filter((s) => s.id !== studentId));
				message.success('Student deleted successfully');
			},
		});
	};

	const handlePayTuition = (studentId: string) => {
		setStudents(students.map((s) => (s.id === studentId ? { ...s, tuitionStatus: 'paid' } : s)));
		message.success('Tuition payment recorded successfully');
	};

	const handleModalOk = () => {
		form.validateFields().then((values) => {
			const studentData = {
				...values,
				enrollmentDate: values.enrollmentDate.format('YYYY-MM-DD'),
				avatar:
					'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
			};

			if (selectedStudent) {
				// Update existing student
				setStudents(
					students.map((s) => (s.id === selectedStudent.id ? { ...s, ...studentData } : s))
				);
				message.success('Student updated successfully');
			} else {
				// Add new student
				const newStudent: Student = {
					key: Date.now().toString(),
					id: `STU${String(students.length + 1).padStart(3, '0')}`,
					...studentData,
					tuitionStatus: 'pending' as const,
				};
				setStudents([...students, newStudent]);
				message.success('Student added successfully');
			}

			setIsModalOpen(false);
			form.resetFields();
		});
	};

	const filteredStudents = students.filter((student) => {
		const matchesSearch =
			student.name.toLowerCase().includes(searchText.toLowerCase()) ||
			student.email.toLowerCase().includes(searchText.toLowerCase()) ||
			student.id.toLowerCase().includes(searchText.toLowerCase());
		const matchesClass = !selectedClass || student.class === selectedClass;
		const matchesStatus = !selectedStatus || student.status === selectedStatus;

		return matchesSearch && matchesClass && matchesStatus;
	});

	const columns: ColumnsType<Student> = [
		{
			title: 'Student',
			dataIndex: 'name',
			key: 'name',
			render: (_, record) => (
				<Space>
					<Avatar src={record.avatar} icon={<UserOutlined />} />
					<div>
						<Text strong>{record.name}</Text>
						<br />
						<Text type="secondary">{record.id}</Text>
					</div>
				</Space>
			),
		},
		{
			title: 'Contact',
			dataIndex: 'contact',
			key: 'contact',
			render: (_, record) => (
				<div>
					<div style={{ marginBottom: 4 }}>
						<MailOutlined style={{ marginRight: 8, color: '#1890ff' }} />
						<Text>{record.email}</Text>
					</div>
					<div>
						<PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
						<Text>{record.phone}</Text>
					</div>
				</div>
			),
		},
		{
			title: 'Class',
			dataIndex: 'class',
			key: 'class',
			render: (text) => <Tag color="blue">{text}</Tag>,
		},
		{
			title: 'Grade',
			dataIndex: 'grade',
			key: 'grade',
			render: (text) => <Tag color="green">{text}</Tag>,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (text) => <Tag color={getStatusColor(text)}>{text.toUpperCase()}</Tag>,
		},
		{
			title: 'Tuition',
			dataIndex: 'tuitionStatus',
			key: 'tuitionStatus',
			render: (text, record) => (
				<div>
					<Tag color={getTuitionStatusColor(text)}>{text.toUpperCase()}</Tag>
					<br />
					<Text type="secondary">${record.tuitionFee}</Text>
				</div>
			),
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Button type="text" icon={<EyeOutlined />} onClick={() => handleViewStudent(record)} />
					<Button type="text" icon={<EditOutlined />} onClick={() => handleEditStudent(record)} />
					{record.tuitionStatus !== 'paid' && (
						<Button
							type="text"
							icon={<DollarOutlined />}
							onClick={() => handlePayTuition(record.id)}
							style={{ color: '#52c41a' }}
						/>
					)}
					<Button
						type="text"
						danger
						icon={<DeleteOutlined />}
						onClick={() => handleDeleteStudent(record.id)}
					/>
				</Space>
			),
		},
	];

	return (
		<div>
			<div style={{ marginBottom: 24 }}>
				<Title level={2}>Students</Title>
				<Text type="secondary">Manage student profiles, enrollment, and tuition payments</Text>
			</div>

			{/* Summary Cards */}
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic
							title="Total Students"
							value={students.length}
							prefix={<UserOutlined style={{ color: '#1890ff' }} />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic
							title="Active Students"
							value={students.filter((s) => s.status === 'active').length}
							prefix={<UserOutlined style={{ color: '#52c41a' }} />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic
							title="Pending Payments"
							value={students.filter((s) => s.tuitionStatus !== 'paid').length}
							prefix={<DollarOutlined style={{ color: '#faad14' }} />}
						/>
					</Card>
				</Col>
			</Row>

			<Card>
				{/* Filters and Search */}
				<div
					style={{
						marginBottom: 16,
						display: 'flex',
						gap: 16,
						alignItems: 'center',
						flexWrap: 'wrap',
					}}
				>
					<Input
						placeholder="Search students..."
						prefix={<SearchOutlined />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 250 }}
					/>
					<Select
						placeholder="Filter by class"
						allowClear
						value={selectedClass}
						onChange={setSelectedClass}
						style={{ width: 150 }}
					>
						<Option value="10-A">10-A</Option>
						<Option value="10-B">10-B</Option>
						<Option value="11-A">11-A</Option>
						<Option value="11-B">11-B</Option>
						<Option value="12-A">12-A</Option>
					</Select>
					<Select
						placeholder="Filter by status"
						allowClear
						value={selectedStatus}
						onChange={setSelectedStatus}
						style={{ width: 150 }}
					>
						<Option value="active">Active</Option>
						<Option value="inactive">Inactive</Option>
						<Option value="graduated">Graduated</Option>
					</Select>
					<Button type="primary" icon={<PlusOutlined />} onClick={handleAddStudent}>
						Add Student
					</Button>
				</div>

				<Table
					columns={columns}
					dataSource={filteredStudents}
					pagination={{
						total: filteredStudents.length,
						pageSize: 10,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} students`,
					}}
					scroll={{ x: 1000 }}
				/>
			</Card>

			{/* Add/Edit Student Modal */}
			<Modal
				title={selectedStudent ? 'Edit Student' : 'Add New Student'}
				open={isModalOpen}
				onOk={handleModalOk}
				onCancel={() => setIsModalOpen(false)}
				width={600}
			>
				<Form
					form={form}
					layout="vertical"
					initialValues={{
						status: 'active',
						tuitionFee: 5000,
					}}
				>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="name"
								label="Full Name"
								rules={[{ required: true, message: 'Please enter student name' }]}
							>
								<Input placeholder="Enter full name" />
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
								<Input placeholder="Enter email address" />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="phone"
								label="Phone"
								rules={[{ required: true, message: 'Please enter phone number' }]}
							>
								<Input placeholder="Enter phone number" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="class"
								label="Class"
								rules={[{ required: true, message: 'Please select class' }]}
							>
								<Select placeholder="Select class">
									<Option value="10-A">10-A</Option>
									<Option value="10-B">10-B</Option>
									<Option value="11-A">11-A</Option>
									<Option value="11-B">11-B</Option>
									<Option value="12-A">12-A</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="grade"
								label="Current Grade"
								rules={[{ required: true, message: 'Please enter grade' }]}
							>
								<Input placeholder="e.g., A, B+, C" />
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
									<Option value="graduated">Graduated</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="enrollmentDate"
								label="Enrollment Date"
								rules={[{ required: true, message: 'Please select enrollment date' }]}
							>
								<DatePicker style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="tuitionFee"
								label="Tuition Fee"
								rules={[{ required: true, message: 'Please enter tuition fee' }]}
							>
								<Input type="number" prefix="$" placeholder="Enter amount" />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item
						name="address"
						label="Address"
						rules={[{ required: true, message: 'Please enter address' }]}
					>
						<Input.TextArea rows={2} placeholder="Enter full address" />
					</Form.Item>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="parentName"
								label="Parent/Guardian Name"
								rules={[{ required: true, message: 'Please enter parent name' }]}
							>
								<Input placeholder="Enter parent/guardian name" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="parentPhone"
								label="Parent/Guardian Phone"
								rules={[{ required: true, message: 'Please enter parent phone' }]}
							>
								<Input placeholder="Enter parent/guardian phone" />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>

			{/* Student Details Drawer */}
			<Drawer
				title="Student Details"
				open={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				width={500}
			>
				{selectedStudent && (
					<div>
						<div style={{ textAlign: 'center', marginBottom: 24 }}>
							<Avatar src={selectedStudent.avatar} size={80} icon={<UserOutlined />} />
							<Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>
								{selectedStudent.name}
							</Title>
							<Text type="secondary">{selectedStudent.id}</Text>
						</div>

						<Descriptions column={1} bordered>
							<Descriptions.Item label="Email">{selectedStudent.email}</Descriptions.Item>
							<Descriptions.Item label="Phone">{selectedStudent.phone}</Descriptions.Item>
							<Descriptions.Item label="Class">
								<Tag color="blue">{selectedStudent.class}</Tag>
							</Descriptions.Item>
							<Descriptions.Item label="Grade">
								<Tag color="green">{selectedStudent.grade}</Tag>
							</Descriptions.Item>
							<Descriptions.Item label="Status">
								<Tag color={getStatusColor(selectedStudent.status)}>
									{selectedStudent.status.toUpperCase()}
								</Tag>
							</Descriptions.Item>
							<Descriptions.Item label="Enrollment Date">
								{dayjs(selectedStudent.enrollmentDate).format('MMMM DD, YYYY')}
							</Descriptions.Item>
							<Descriptions.Item label="Address">{selectedStudent.address}</Descriptions.Item>
						</Descriptions>

						<Divider>Parent/Guardian Information</Divider>

						<Descriptions column={1} bordered>
							<Descriptions.Item label="Name">{selectedStudent.parentName}</Descriptions.Item>
							<Descriptions.Item label="Phone">{selectedStudent.parentPhone}</Descriptions.Item>
						</Descriptions>

						<Divider>Tuition Information</Divider>

						<div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
							<Row gutter={16}>
								<Col span={12}>
									<Statistic title="Tuition Fee" value={selectedStudent.tuitionFee} prefix="$" />
								</Col>
								<Col span={12}>
									<div>
										<Text type="secondary">Payment Status</Text>
										<br />
										<Tag color={getTuitionStatusColor(selectedStudent.tuitionStatus)}>
											{selectedStudent.tuitionStatus.toUpperCase()}
										</Tag>
									</div>
								</Col>
							</Row>
							{selectedStudent.tuitionStatus !== 'paid' && (
								<Button
									type="primary"
									icon={<DollarOutlined />}
									style={{ marginTop: 16 }}
									onClick={() => handlePayTuition(selectedStudent.id)}
								>
									Record Payment
								</Button>
							)}
						</div>
					</div>
				)}
			</Drawer>
		</div>
	);
};

export default Students;
