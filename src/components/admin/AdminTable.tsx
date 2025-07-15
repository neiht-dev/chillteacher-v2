'use client';

import {
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	PlusOutlined,
	ReloadOutlined,
} from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	Drawer,
	Form,
	Input,
	Row,
	Select,
	Space,
	Table,
	Typography,
	App as AntApp,
	Tooltip,
	Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

const { Title } = Typography;

interface AdminTableProps {
	displayName: string;
	columns: ColumnsType<Record<string, unknown>>;
	data: Record<string, unknown>[];
	loading: boolean;
	onCreate: (values: Record<string, unknown>) => Promise<void>;
	onUpdate: (id: string, values: Record<string, unknown>) => Promise<void>;
	onDelete: (id: string) => Promise<void>;
	onRefresh: () => void;
	formFields: FormField[];
	initialFormValues?: Record<string, unknown>;
}

interface FormField {
	name: string;
	label: string;
	type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date' | 'boolean';
	required?: boolean;
	options?: { label: string; value: unknown }[];
	placeholder?: string;
}

export default function AdminTable({
	displayName,
	columns,
	data,
	loading,
	onCreate,
	onUpdate,
	onDelete,
	onRefresh,
	formFields,
	initialFormValues = {},
}: AdminTableProps) {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const [editingRecord, setEditingRecord] = useState<Record<string, unknown> | null>(null);
	const [form] = Form.useForm();
	const { message: antMessage } = AntApp.useApp();

	// Add action column to existing columns
	const tableColumns: ColumnsType<Record<string, unknown>> = [
		...columns,
		{
			title: 'Thao tác',
			key: 'actions',
			width: 120,
			render: (_, record) => (
				<Space size="small">
					<Tooltip title="Xem chi tiết">
						<Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
					</Tooltip>
					<Tooltip title="Chỉnh sửa">
						<Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					</Tooltip>
					<Tooltip title="Xóa">
						<Popconfirm
							title="Bạn có chắc chắn muốn xóa?"
							description="Hành động này không thể hoàn tác."
							onConfirm={() => handleDelete(record.id as string)}
							okText="Có"
							cancelText="Không"
						>
							<Button type="text" danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</Space>
			),
		},
	];

	const handleCreate = () => {
		setEditingRecord(null);
		form.resetFields();
		setIsDrawerVisible(true);
	};

	const handleEdit = (record: Record<string, unknown>) => {
		setEditingRecord(record);
		form.setFieldsValue(record);
		setIsDrawerVisible(true);
	};

	const handleView = (record: Record<string, unknown>) => {
		setEditingRecord(record);
		form.setFieldsValue(record);
		setIsDrawerVisible(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await onDelete(id);
			antMessage.success('Xóa thành công');
			onRefresh();
		} catch {
			antMessage.error('Có lỗi xảy ra khi xóa');
		}
	};

	const handleSubmit = async (values: Record<string, unknown>) => {
		try {
			if (editingRecord) {
				await onUpdate(editingRecord.id as string, values);
				antMessage.success('Cập nhật thành công');
			} else {
				await onCreate(values);
				antMessage.success('Tạo mới thành công');
			}
			setIsDrawerVisible(false);
			onRefresh();
		} catch {
			antMessage.error('Có lỗi xảy ra');
		}
	};

	const renderFormField = (field: FormField) => {
		const commonProps = {
			placeholder: field.placeholder,
		};

		switch (field.type) {
			case 'textarea':
				return <Input.TextArea rows={4} {...commonProps} />;
			case 'select':
				return <Select options={field.options} {...commonProps} />;
			case 'date':
				return <Input type="date" {...commonProps} />;
			case 'boolean':
				return (
					<Select
						options={[
							{ label: 'Có', value: true },
							{ label: 'Không', value: false },
						]}
						{...commonProps}
					/>
				);
			case 'number':
				return <Input type="number" {...commonProps} />;
			case 'email':
				return <Input type="email" {...commonProps} />;
			case 'password':
				return <Input.Password {...commonProps} />;
			default:
				return <Input {...commonProps} />;
		}
	};

	return (
		<div style={{ padding: '24px' }}>
			<Card>
				<Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
					<Col>
						<Title level={3} style={{ margin: 0 }}>
							Quản lý {displayName}
						</Title>
					</Col>
					<Col>
						<Space>
							<Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
								Làm mới
							</Button>
							<Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
								Thêm mới
							</Button>
						</Space>
					</Col>
				</Row>

				<Table
					columns={tableColumns}
					dataSource={data}
					loading={loading}
					rowKey="id"
					pagination={{
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
					}}
				/>
			</Card>

			<Drawer
				title={editingRecord ? `Chỉnh sửa ${displayName}` : `Thêm mới ${displayName}`}
				width={600}
				open={isDrawerVisible}
				onClose={() => setIsDrawerVisible(false)}
				footer={
					<Space>
						<Button onClick={() => setIsDrawerVisible(false)}>Hủy</Button>
						<Button type="primary" onClick={() => form.submit()}>
							{editingRecord ? 'Cập nhật' : 'Tạo mới'}
						</Button>
					</Space>
				}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					initialValues={initialFormValues}
				>
					{formFields.map((field) => (
						<Form.Item
							key={field.name}
							name={field.name}
							label={field.label}
							rules={[
								{
									required: field.required,
									message: `Vui lòng nhập ${field.label.toLowerCase()}`,
								},
							]}
						>
							{renderFormField(field)}
						</Form.Item>
					))}
				</Form>
			</Drawer>
		</div>
	);
}
