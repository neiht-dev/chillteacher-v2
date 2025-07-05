import {
	BookOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	PlusOutlined,
	SearchOutlined,
	UsergroupAddOutlined,
} from "@ant-design/icons";
import {
	Avatar,
	Button,
	Card,
	Col,
	Drawer,
	Form,
	Input,
	List,
	Modal,
	message,
	Progress,
	Row,
	Select,
	Space,
	Statistic,
	Table,
	Tag,
	Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type React from "react";
import { useState } from "react";

const { Title, Text } = Typography;

// Define School Type
interface School {
	key: string;
	id: string;
	name: string;
	address: string;
	email: string;
	phone: string;
	type: "Public" | "Private";
	status: "Active" | "Inactive";
}

// Mock Data
const Schools: React.FC = () => {
	const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [form] = Form.useForm();
	const [searchText, setSearchText] = useState("");
	const [selectedType, setSelectedType] = useState<string>("");
	const [selectedStatus, setSelectedStatus] = useState<string>("");

	// Initial state
	const [schools, setSchools] = useState<School[]>([
		{
			key: "1",
			id: "SCH001",
			name: "Green Valley High School",
			address: "123 Main Street, Cityville",
			email: "info@gvhs.edu",
			phone: "+1 555 123 4567",
			type: "Public",
			status: "Active",
		},
		{
			key: "2",
			id: "SCH002",
			name: "St. Mary's Private School",
			address: "456 Oak Avenue, Townsville",
			email: "contact@stmarys.edu",
			phone: "+1 555 987 6543",
			type: "Private",
			status: "Active",
		},
	]);

	// Status color mapping
	const getStatusColor = (status: string) => {
		return status === "Active" ? "green" : "orange";
	};

	// Handle Add School
	const handleAddSchool = () => {
		setSelectedSchool(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	// Handle Edit School
	const handleEditSchool = (schoolData: School) => {
		setSelectedSchool(schoolData);
		form.setFieldsValue(schoolData);
		setIsModalOpen(true);
	};

	// Handle View School
	const handleViewSchool = (schoolData: School) => {
		setSelectedSchool(schoolData);
		setIsDrawerOpen(true);
	};

	// Handle Delete School
	const handleDeleteSchool = (schoolId: string) => {
		Modal.confirm({
			title: "Are you sure you want to delete this school?",
			content: "This action cannot be undone.",
			okText: "Yes, Delete",
			okType: "danger",
			cancelText: "Cancel",
			onOk: () => {
				setSchools(schools.filter((s) => s.id !== schoolId));
				message.success("School deleted successfully");
			},
		});
	};

	// Modal Submit
	const handleModalOk = () => {
		form.validateFields().then((values) => {
			if (selectedSchool) {
				setSchools(
					schools.map((s) =>
						s.id === selectedSchool.id ? { ...s, ...values } : s,
					),
				);
				message.success("School updated successfully");
			} else {
				const newSchool: School = {
					key: Date.now().toString(),
					id: `SCH${String(schools.length + 1).padStart(3, "0")}`,
					...values,
				};
				setSchools([...schools, newSchool]);
				message.success("School added successfully");
			}
			setIsModalOpen(false);
			form.resetFields();
		});
	};

	// Filter schools
	const filteredSchools = schools.filter((school) => {
		const matchesSearch =
			school.name.toLowerCase().includes(searchText.toLowerCase()) ||
			school.address.toLowerCase().includes(searchText.toLowerCase()) ||
			school.email.toLowerCase().includes(searchText.toLowerCase());

		const matchesType = !selectedType || school.type === selectedType;
		const matchesStatus = !selectedStatus || school.status === selectedStatus;

		return matchesSearch && matchesType && matchesStatus;
	});

	// Table columns
	const columns: ColumnsType<School> = [
		{
			title: "School Name",
			dataIndex: "name",
			key: "name",
			render: (_, record) => (
				<div>
					<Text strong>{record.name}</Text>
					<br />
					<Text type="secondary">{record.id}</Text>
				</div>
			),
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
		},
		{
			title: "Contact",
			dataIndex: "email",
			key: "contact",
			render: (_, record) => (
				<div>
					<Text>{record.email}</Text>
					<br />
					<Text type="secondary">{record.phone}</Text>
				</div>
			),
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
			render: (text) => (
				<Tag color={text === "Public" ? "blue" : "gold"}>{text}</Tag>
			),
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (text) => (
				<Tag color={getStatusColor(text)}>{text.toUpperCase()}</Tag>
			),
		},
		{
			title: "Actions",
			key: "actions",
			render: (_, record) => (
				<Space>
					<Button
						type="text"
						icon={<EyeOutlined />}
						onClick={() => handleViewSchool(record)}
					/>
					<Button
						type="text"
						icon={<EditOutlined />}
						onClick={() => handleEditSchool(record)}
					/>
					<Button
						type="text"
						danger
						icon={<DeleteOutlined />}
						onClick={() => handleDeleteSchool(record.id)}
					/>
				</Space>
			),
		},
	];

	return (
		<div>
			{/* Header */}
			<div style={{ marginBottom: 24 }}>
				<Title level={2}>Schools</Title>
				<Text type="secondary">Manage school information and settings</Text>
			</div>

			{/* Summary Cards */}
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic
							title="Total Schools"
							value={schools.length}
							prefix={<BookOutlined style={{ color: "#1890ff" }} />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic
							title="Active Schools"
							value={schools.filter((s) => s.status === "Active").length}
							prefix={<BookOutlined style={{ color: "#52c41a" }} />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic
							title="Public/Private"
							value={`${schools.filter((s) => s.type === "Public").length}/${
								schools.filter((s) => s.type === "Private").length
							}`}
							prefix={<UsergroupAddOutlined style={{ color: "#faad14" }} />}
						/>
					</Card>
				</Col>
			</Row>

			<Card>
				{/* Filters and Search */}
				<div
					style={{
						marginBottom: 16,
						display: "flex",
						gap: 16,
						alignItems: "center",
						flexWrap: "wrap",
					}}
				>
					<Input
						placeholder="Search schools..."
						prefix={<SearchOutlined />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 250 }}
					/>
					<Select
						placeholder="Filter by type"
						allowClear
						value={selectedType}
						onChange={setSelectedType}
						style={{ width: 150 }}
					>
						<Select.Option value="Public">Public</Select.Option>
						<Select.Option value="Private">Private</Select.Option>
					</Select>
					<Select
						placeholder="Filter by status"
						allowClear
						value={selectedStatus}
						onChange={setSelectedStatus}
						style={{ width: 150 }}
					>
						<Select.Option value="Active">Active</Select.Option>
						<Select.Option value="Inactive">Inactive</Select.Option>
					</Select>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={handleAddSchool}
					>
						Add School
					</Button>
				</div>

				{/* Table */}
				<Table
					columns={columns}
					dataSource={filteredSchools}
					pagination={{
						total: filteredSchools.length,
						pageSize: 10,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total, range) =>
							`${range[0]}-${range[1]} of ${total} schools`,
					}}
					scroll={{ x: 1000 }}
				/>
			</Card>

			{/* Add/Edit Modal */}
			<Modal
				title={selectedSchool ? "Edit School" : "Add New School"}
				open={isModalOpen}
				onOk={handleModalOk}
				onCancel={() => setIsModalOpen(false)}
				width={600}
			>
				<Form form={form} layout="vertical">
					<Form.Item
						label="School Name"
						name="name"
						rules={[{ required: true, message: "Please enter school name" }]}
					>
						<Input placeholder="Enter school name" />
					</Form.Item>
					<Form.Item
						label="Address"
						name="address"
						rules={[{ required: true, message: "Please enter address" }]}
					>
						<Input placeholder="Enter school address" />
					</Form.Item>
					<Form.Item
						label="Email"
						name="email"
						rules={[
							{ required: true, message: "Please enter email" },
							{ type: "email", message: "Invalid email format" },
						]}
					>
						<Input placeholder="Enter contact email" />
					</Form.Item>
					<Form.Item
						label="Phone"
						name="phone"
						rules={[{ required: true, message: "Please enter phone number" }]}
					>
						<Input placeholder="Enter contact number" />
					</Form.Item>
					<Form.Item
						label="Type"
						name="type"
						rules={[{ required: true, message: "Please select type" }]}
					>
						<Select>
							<Select.Option value="Public">Public</Select.Option>
							<Select.Option value="Private">Private</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						label="Status"
						name="status"
						rules={[{ required: true, message: "Please select status" }]}
					>
						<Select>
							<Select.Option value="Active">Active</Select.Option>
							<Select.Option value="Inactive">Inactive</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>

			{/* View Drawer */}
			<Drawer
				title="School Details"
				open={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				width={500}
			>
				{selectedSchool && (
					<div>
						<div style={{ marginBottom: 24 }}>
							<Title level={4}>{selectedSchool.name}</Title>
							<Text type="secondary">{selectedSchool.id}</Text>
						</div>
						<List
							itemLayout="horizontal"
							dataSource={[
								{
									label: "Address",
									value: selectedSchool.address,
								},
								{
									label: "Email",
									value: selectedSchool.email,
								},
								{
									label: "Phone",
									value: selectedSchool.phone,
								},
								{
									label: "Type",
									value: selectedSchool.type,
								},
								{
									label: "Status",
									value: (
										<Tag color={getStatusColor(selectedSchool.status)}>
											{selectedSchool.status}
										</Tag>
									),
								},
							]}
							renderItem={(item) => (
								<List.Item>
									<List.Item.Meta
										title={<Text strong>{item.label}</Text>}
										description={<Text>{item.value}</Text>}
									/>
								</List.Item>
							)}
						/>
					</div>
				)}
			</Drawer>
		</div>
	);
};

export default Schools;
