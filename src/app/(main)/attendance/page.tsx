'use client';

import {
	CalendarOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	EditOutlined,
	PlusOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {
	Avatar,
	Badge,
	Button,
	Calendar,
	Card,
	Col,
	DatePicker,
	Form,
	Input,
	List,
	Modal,
	message,
	Row,
	Select,
	Space,
	Statistic,
	Tag,
	Typography,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type React from 'react';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

interface AttendanceRecord {
	date: string;
	status: 'present' | 'absent' | 'late' | 'excused';
	reason?: string;
	arrivalTime?: string;
}

interface Student {
	id: string;
	name: string;
	avatar: string;
	class: string;
	attendance: AttendanceRecord[];
}

const StudentAttendance: React.FC = () => {
	const [selectedStudent, setSelectedStudent] = useState<string>('');
	const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();

	// Mock data
	const students: Student[] = [
		{
			id: 'STU001',
			name: 'Alice Johnson',
			avatar:
				'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
			class: '10-A',
			attendance: [
				{ date: '2024-01-15', status: 'present', arrivalTime: '8:55' },
				{ date: '2024-01-16', status: 'late', arrivalTime: '9:15' },
				{ date: '2024-01-17', status: 'present', arrivalTime: '8:50' },
				{ date: '2024-01-18', status: 'absent' },
				{ date: '2024-01-19', status: 'present', arrivalTime: '8:58' },
				{
					date: '2024-01-22',
					status: 'excused',
					reason: 'Medical appointment',
				},
				{ date: '2024-01-23', status: 'present', arrivalTime: '8:52' },
				{ date: '2024-01-24', status: 'late', arrivalTime: '9:10' },
				{ date: '2024-01-25', status: 'present', arrivalTime: '8:45' },
				{ date: '2024-01-26', status: 'present', arrivalTime: '8:59' },
			],
		},
		{
			id: 'STU002',
			name: 'Bob Smith',
			avatar:
				'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
			class: '10-A',
			attendance: [
				{ date: '2024-01-15', status: 'present', arrivalTime: '9:00' },
				{ date: '2024-01-16', status: 'present', arrivalTime: '8:55' },
				{ date: '2024-01-17', status: 'late', arrivalTime: '9:20' },
				{ date: '2024-01-18', status: 'present', arrivalTime: '8:58' },
				{ date: '2024-01-19', status: 'absent' },
				{ date: '2024-01-22', status: 'present', arrivalTime: '8:50' },
				{ date: '2024-01-23', status: 'present', arrivalTime: '9:05' },
				{ date: '2024-01-24', status: 'present', arrivalTime: '8:55' },
				{ date: '2024-01-25', status: 'excused', reason: 'Family emergency' },
				{ date: '2024-01-26', status: 'present', arrivalTime: '8:48' },
			],
		},
		{
			id: 'STU003',
			name: 'Carol Davis',
			avatar:
				'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
			class: '11-A',
			attendance: [
				{ date: '2024-01-15', status: 'present', arrivalTime: '8:45' },
				{ date: '2024-01-16', status: 'present', arrivalTime: '8:50' },
				{ date: '2024-01-17', status: 'present', arrivalTime: '8:55' },
				{ date: '2024-01-18', status: 'present', arrivalTime: '8:52' },
				{ date: '2024-01-19', status: 'present', arrivalTime: '8:48' },
				{ date: '2024-01-22', status: 'present', arrivalTime: '8:58' },
				{ date: '2024-01-23', status: 'late', arrivalTime: '9:12' },
				{ date: '2024-01-24', status: 'present', arrivalTime: '8:50' },
				{ date: '2024-01-25', status: 'present', arrivalTime: '8:55' },
				{ date: '2024-01-26', status: 'present', arrivalTime: '8:47' },
			],
		},
	];

	const selectedStudentData = students.find((s) => s.id === selectedStudent);

	const getStatusColor = (
		status: string
	): 'success' | 'error' | 'warning' | 'processing' | 'default' => {
		switch (status) {
			case 'present':
				return 'success';
			case 'absent':
				return 'error';
			case 'late':
				return 'warning';
			case 'excused':
				return 'processing';
			default:
				return 'default';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'present':
				return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
			case 'absent':
				return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
			case 'late':
				return <ClockCircleOutlined style={{ color: '#faad14' }} />;
			case 'excused':
				return <CalendarOutlined style={{ color: '#1890ff' }} />;
			default:
				return null;
		}
	};

	const getListData = (value: Dayjs) => {
		if (!selectedStudentData) return [];

		const dateStr = value.format('YYYY-MM-DD');
		const record = selectedStudentData.attendance.find((a) => a.date === dateStr);

		if (record) {
			return [
				{
					type: getStatusColor(record.status),
					content: record.status.charAt(0).toUpperCase() + record.status.slice(1),
				},
			];
		}
		return [];
	};

	const dateCellRender = (value: Dayjs) => {
		const listData = getListData(value);
		return (
			<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
				{listData.map((item, index) => (
					<li key={index}>
						<Badge status={item.type} text={item.content} />
					</li>
				))}
			</ul>
		);
	};

	const onDateSelect = (date: Dayjs) => {
		setSelectedDate(date);
		if (selectedStudentData) {
			const dateStr = date.format('YYYY-MM-DD');
			const record = selectedStudentData.attendance.find((a) => a.date === dateStr);
			if (record) {
				form.setFieldsValue({
					date: date,
					status: record.status,
					reason: record.reason,
					arrivalTime: record.arrivalTime,
				});
				setIsModalOpen(true);
			}
		}
	};

	const handleAddRecord = () => {
		form.setFieldsValue({
			date: selectedDate,
			status: 'present',
		});
		setIsModalOpen(true);
	};

	const handleModalOk = () => {
		form.validateFields().then((values) => {
			const dateStr = values.date.format('YYYY-MM-DD');
			message.success(`Attendance record updated for ${dateStr}`);
			setIsModalOpen(false);
			form.resetFields();
		});
	};

	// Calculate statistics
	const getAttendanceStats = () => {
		if (!selectedStudentData)
			return { present: 0, absent: 0, late: 0, excused: 0, total: 0, rate: 0 };

		const attendance = selectedStudentData.attendance;
		const present = attendance.filter((a) => a.status === 'present').length;
		const absent = attendance.filter((a) => a.status === 'absent').length;
		const late = attendance.filter((a) => a.status === 'late').length;
		const excused = attendance.filter((a) => a.status === 'excused').length;
		const total = attendance.length;
		const rate = total > 0 ? Math.round(((present + late + excused) / total) * 100) : 0;

		return { present, absent, late, excused, total, rate };
	};

	const stats = getAttendanceStats();

	// Get recent attendance records
	const getRecentAttendance = () => {
		if (!selectedStudentData) return [];

		return selectedStudentData.attendance
			.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
			.slice(0, 10);
	};

	return (
		<div>
			<div style={{ marginBottom: 24 }}>
				<Title level={2}>Student Attendance</Title>
				<Text type="secondary">Track and manage individual student attendance records</Text>
			</div>

			{/* Student Selection */}
			<Card style={{ marginBottom: 24 }}>
				<Row gutter={16} align="middle">
					<Col>
						<Text strong>Select Student:</Text>
					</Col>
					<Col>
						<Select
							placeholder="Choose a student"
							value={selectedStudent}
							onChange={setSelectedStudent}
							style={{ width: 300 }}
							showSearch
							filterOption={(input, option) =>
								(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
							}
						>
							{students.map((student) => (
								<Option key={student.id} value={student.id}>
									<Space>
										<Avatar src={student.avatar} size="small" />
										{student.name} - {student.class}
									</Space>
								</Option>
							))}
						</Select>
					</Col>
					<Col flex="auto" style={{ textAlign: 'right' }}>
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={handleAddRecord}
							disabled={!selectedStudent}
						>
							Add Record
						</Button>
					</Col>
				</Row>
			</Card>

			{selectedStudent && selectedStudentData && (
				<>
					{/* Student Info & Statistics */}
					<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
						<Col xs={24} lg={8}>
							<Card>
								<div style={{ textAlign: 'center' }}>
									<Avatar src={selectedStudentData.avatar} size={64} icon={<UserOutlined />} />
									<Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>
										{selectedStudentData.name}
									</Title>
									<Text type="secondary">{selectedStudentData.id}</Text>
									<br />
									<Tag color="blue" style={{ marginTop: 8 }}>
										Class {selectedStudentData.class}
									</Tag>
								</div>
							</Card>
						</Col>
						<Col xs={24} lg={16}>
							<Row gutter={[16, 16]}>
								<Col xs={12} sm={6}>
									<Card>
										<Statistic
											title="Present"
											value={stats.present}
											prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
											valueStyle={{ color: '#52c41a' }}
										/>
									</Card>
								</Col>
								<Col xs={12} sm={6}>
									<Card>
										<Statistic
											title="Absent"
											value={stats.absent}
											prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
											valueStyle={{ color: '#ff4d4f' }}
										/>
									</Card>
								</Col>
								<Col xs={12} sm={6}>
									<Card>
										<Statistic
											title="Late"
											value={stats.late}
											prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
											valueStyle={{ color: '#faad14' }}
										/>
									</Card>
								</Col>
								<Col xs={12} sm={6}>
									<Card>
										<Statistic
											title="Attendance Rate"
											value={stats.rate}
											suffix="%"
											prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
											valueStyle={{
												color:
													stats.rate >= 90 ? '#52c41a' : stats.rate >= 75 ? '#faad14' : '#ff4d4f',
											}}
										/>
									</Card>
								</Col>
							</Row>
						</Col>
					</Row>

					<Row gutter={[16, 16]}>
						{/* Calendar View */}
						<Col xs={24} lg={16}>
							<Card title="Attendance Calendar">
								<Calendar
									dateCellRender={dateCellRender}
									onSelect={onDateSelect}
									value={selectedDate}
								/>
							</Card>
						</Col>

						{/* Recent Records */}
						<Col xs={24} lg={8}>
							<Card title="Recent Attendance">
								<List
									dataSource={getRecentAttendance()}
									renderItem={(record) => (
										<List.Item
											key={record.date}
											actions={[
												<Button
													// TODO: Fix key later, just add to pass the linter
													key={record.date}
													type="text"
													icon={<EditOutlined />}
													onClick={() => {
														form.setFieldsValue({
															date: dayjs(record.date),
															status: record.status,
															reason: record.reason,
															arrivalTime: record.arrivalTime,
														});
														setIsModalOpen(true);
													}}
												/>,
											]}
										>
											<List.Item.Meta
												avatar={getStatusIcon(record.status)}
												title={
													<Space>
														<Text strong>{dayjs(record.date).format('MMM DD, YYYY')}</Text>
														<Tag color={getStatusColor(record.status)}>
															{record.status.toUpperCase()}
														</Tag>
													</Space>
												}
												description={
													<div>
														{record.arrivalTime && (
															<Text type="secondary">Arrived: {record.arrivalTime}</Text>
														)}
														{record.reason && (
															<div>
																<Text type="secondary">Reason: {record.reason}</Text>
															</div>
														)}
													</div>
												}
											/>
										</List.Item>
									)}
								/>
							</Card>
						</Col>
					</Row>
				</>
			)}

			{/* Add/Edit Record Modal */}
			<Modal
				title="Attendance Record"
				open={isModalOpen}
				onOk={handleModalOk}
				onCancel={() => setIsModalOpen(false)}
				width={500}
			>
				<Form form={form} layout="vertical">
					<Form.Item
						name="date"
						label="Date"
						rules={[{ required: true, message: 'Please select date' }]}
					>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name="status"
						label="Status"
						rules={[{ required: true, message: 'Please select status' }]}
					>
						<Select>
							<Option value="present">Present</Option>
							<Option value="absent">Absent</Option>
							<Option value="late">Late</Option>
							<Option value="excused">Excused</Option>
						</Select>
					</Form.Item>

					<Form.Item name="arrivalTime" label="Arrival Time">
						<Input placeholder="e.g., 9:15" />
					</Form.Item>

					<Form.Item name="reason" label="Reason (for absences/excused)">
						<Input.TextArea rows={3} placeholder="Enter reason for absence or excuse..." />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default StudentAttendance;
