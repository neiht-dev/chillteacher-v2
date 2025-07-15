'use client';

import { useState, useEffect } from 'react';
import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminTable from '@/components/admin/AdminTable';

interface Class {
	id: string;
	name: string;
	description?: string;
	teacher_id: string;
	course_id: string;
	room?: string;
	capacity: number;
	enrolled: number;
	status: 'active' | 'inactive' | 'completed' | 'cancelled';
	start_date?: string;
	end_date?: string;
	schedule?: string;
	created: string;
	updated: string;
}

const columns: ColumnsType<Class> = [
	{
		title: 'Tên lớp',
		dataIndex: 'name',
		key: 'name',
		width: 200,
	},
	{
		title: 'Mô tả',
		dataIndex: 'description',
		key: 'description',
		width: 250,
		ellipsis: true,
	},
	{
		title: 'Phòng học',
		dataIndex: 'room',
		key: 'room',
		width: 100,
	},
	{
		title: 'Sức chứa',
		dataIndex: 'capacity',
		key: 'capacity',
		width: 80,
	},
	{
		title: 'Đã đăng ký',
		dataIndex: 'enrolled',
		key: 'enrolled',
		width: 100,
		render: (enrolled: number, record: Class) => (
			<span>
				{enrolled}/{record.capacity}
			</span>
		),
	},
	{
		title: 'Trạng thái',
		dataIndex: 'status',
		key: 'status',
		width: 100,
		render: (status: string) => {
			const color =
				status === 'active'
					? 'green'
					: status === 'inactive'
						? 'orange'
						: status === 'completed'
							? 'blue'
							: 'red';
			return <Tag color={color}>{status.toUpperCase()}</Tag>;
		},
	},
	{
		title: 'Ngày bắt đầu',
		dataIndex: 'start_date',
		key: 'start_date',
		width: 120,
		render: (date: string) => (date ? new Date(date).toLocaleDateString('vi-VN') : '-'),
	},
	{
		title: 'Ngày kết thúc',
		dataIndex: 'end_date',
		key: 'end_date',
		width: 120,
		render: (date: string) => (date ? new Date(date).toLocaleDateString('vi-VN') : '-'),
	},
	{
		title: 'Ngày tạo',
		dataIndex: 'created',
		key: 'created',
		width: 120,
		render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
	},
];

const formFields = [
	{
		name: 'name',
		label: 'Tên lớp',
		type: 'text' as const,
		required: true,
		placeholder: 'Nhập tên lớp học',
	},
	{
		name: 'description',
		label: 'Mô tả',
		type: 'textarea' as const,
		required: false,
		placeholder: 'Nhập mô tả lớp học',
	},
	{
		name: 'teacher_id',
		label: 'ID Giáo viên',
		type: 'text' as const,
		required: true,
		placeholder: 'Nhập ID giáo viên',
	},
	{
		name: 'course_id',
		label: 'ID Khóa học',
		type: 'text' as const,
		required: true,
		placeholder: 'Nhập ID khóa học',
	},
	{
		name: 'room',
		label: 'Phòng học',
		type: 'text' as const,
		required: false,
		placeholder: 'Nhập phòng học',
	},
	{
		name: 'capacity',
		label: 'Sức chứa',
		type: 'number' as const,
		required: true,
		placeholder: 'Nhập sức chứa lớp học',
	},
	{
		name: 'enrolled',
		label: 'Số học viên đã đăng ký',
		type: 'number' as const,
		required: true,
		placeholder: 'Nhập số học viên đã đăng ký',
	},
	{
		name: 'status',
		label: 'Trạng thái',
		type: 'select' as const,
		required: true,
		options: [
			{ label: 'Hoạt động', value: 'active' },
			{ label: 'Không hoạt động', value: 'inactive' },
			{ label: 'Đã hoàn thành', value: 'completed' },
			{ label: 'Đã hủy', value: 'cancelled' },
		],
	},
	{
		name: 'start_date',
		label: 'Ngày bắt đầu',
		type: 'date' as const,
		required: false,
	},
	{
		name: 'end_date',
		label: 'Ngày kết thúc',
		type: 'date' as const,
		required: false,
	},
	{
		name: 'schedule',
		label: 'Lịch học (JSON)',
		type: 'textarea' as const,
		required: false,
		placeholder: 'Nhập lịch học dạng JSON',
	},
];

export default function ClassesAdminPage() {
	const [data, setData] = useState<Class[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/admin/classes');
			if (response.ok) {
				const result = await response.json();
				setData(result);
			}
		} catch (error) {
			console.error('Error fetching classes:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleCreate = async (values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/classes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(values),
		});

		if (!response.ok) {
			throw new Error('Failed to create class');
		}
	};

	const handleUpdate = async (id: string, values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/classes', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id, ...values }),
		});

		if (!response.ok) {
			throw new Error('Failed to update class');
		}
	};

	const handleDelete = async (id: string) => {
		const response = await fetch(`/api/admin/classes?id=${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error('Failed to delete class');
		}
	};

	return (
		<AdminTable
			displayName="Lớp học"
			columns={columns as ColumnsType<Record<string, unknown>>}
			data={data as unknown as Record<string, unknown>[]}
			loading={loading}
			onCreate={handleCreate}
			onUpdate={handleUpdate}
			onDelete={handleDelete}
			onRefresh={fetchData}
			formFields={formFields}
		/>
	);
}
