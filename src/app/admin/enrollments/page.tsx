'use client';

import { useState, useEffect } from 'react';
import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminTable from '@/components/admin/AdminTable';

interface Enrollment {
	id: string;
	student_id: string;
	class_id: string;
	status: 'pending' | 'approved' | 'rejected' | 'cancelled';
	enrolled_at: string;
	notes?: string;
	created: string;
	updated: string;
}

const columns: ColumnsType<Enrollment> = [
	{
		title: 'ID Học viên',
		dataIndex: 'student_id',
		key: 'student_id',
		width: 150,
	},
	{
		title: 'ID Lớp học',
		dataIndex: 'class_id',
		key: 'class_id',
		width: 150,
	},
	{
		title: 'Trạng thái',
		dataIndex: 'status',
		key: 'status',
		width: 120,
		render: (status: string) => {
			const color =
				status === 'approved'
					? 'green'
					: status === 'pending'
						? 'orange'
						: status === 'rejected'
							? 'red'
							: 'default';
			return <Tag color={color}>{status.toUpperCase()}</Tag>;
		},
	},
	{
		title: 'Ngày đăng ký',
		dataIndex: 'enrolled_at',
		key: 'enrolled_at',
		width: 150,
		render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
	},
	{
		title: 'Ghi chú',
		dataIndex: 'notes',
		key: 'notes',
		width: 200,
		ellipsis: true,
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
		name: 'student_id',
		label: 'ID Học viên',
		type: 'text' as const,
		required: true,
		placeholder: 'Nhập ID học viên',
	},
	{
		name: 'class_id',
		label: 'ID Lớp học',
		type: 'text' as const,
		required: true,
		placeholder: 'Nhập ID lớp học',
	},
	{
		name: 'status',
		label: 'Trạng thái',
		type: 'select' as const,
		required: true,
		options: [
			{ label: 'Chờ xác nhận', value: 'pending' },
			{ label: 'Đã duyệt', value: 'approved' },
			{ label: 'Từ chối', value: 'rejected' },
			{ label: 'Đã hủy', value: 'cancelled' },
		],
	},
	{
		name: 'enrolled_at',
		label: 'Ngày đăng ký',
		type: 'date' as const,
		required: true,
	},
	{
		name: 'notes',
		label: 'Ghi chú',
		type: 'textarea' as const,
		required: false,
		placeholder: 'Nhập ghi chú',
	},
];

export default function EnrollmentsAdminPage() {
	const [data, setData] = useState<Enrollment[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/admin/enrollments');
			if (response.ok) {
				const result = await response.json();
				setData(result);
			}
		} catch (error) {
			console.error('Error fetching enrollments:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleCreate = async (values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/enrollments', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(values),
		});

		if (!response.ok) {
			throw new Error('Failed to create enrollment');
		}
	};

	const handleUpdate = async (id: string, values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/enrollments', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id, ...values }),
		});

		if (!response.ok) {
			throw new Error('Failed to update enrollment');
		}
	};

	const handleDelete = async (id: string) => {
		const response = await fetch(`/api/admin/enrollments?id=${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error('Failed to delete enrollment');
		}
	};

	return (
		<AdminTable
			displayName="Đăng ký học"
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
