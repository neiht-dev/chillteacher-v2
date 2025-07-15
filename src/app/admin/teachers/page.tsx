'use client';

import { useState, useEffect } from 'react';
import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminTable from '@/components/admin/AdminTable';

interface Teacher {
	id: string;
	name: string;
	email: string;
	phone: string;
	department?: string;
	subjects?: string; // JSON string
	status: 'active' | 'inactive' | 'on-leave';
	joining_date?: string;
	avatar?: string;
	address?: string;
	qualification?: string;
	experience?: number;
	salary?: number;
	classes?: string; // JSON string
	schedule?: string; // JSON string
	created: string;
	updated: string;
}

const columns: ColumnsType<Teacher> = [
	{ title: 'Tên', dataIndex: 'name', key: 'name', width: 150 },
	{ title: 'Email', dataIndex: 'email', key: 'email', width: 200 },
	{ title: 'Phòng ban', dataIndex: 'department', key: 'department', width: 120 },
	{
		title: 'Trạng thái',
		dataIndex: 'status',
		key: 'status',
		width: 100,
		render: (status: string) => {
			const color = status === 'active' ? 'green' : status === 'on-leave' ? 'orange' : 'red';
			return <Tag color={color}>{status.toUpperCase()}</Tag>;
		},
	},
	{
		title: 'Ngày vào',
		dataIndex: 'joining_date',
		key: 'joining_date',
		width: 120,
		render: (date: string) => (date ? new Date(date).toLocaleDateString('vi-VN') : ''),
	},
	{ title: 'Kinh nghiệm', dataIndex: 'experience', key: 'experience', width: 100 },
	{ title: 'Lương', dataIndex: 'salary', key: 'salary', width: 100 },
];

const formFields = [
	{
		name: 'name',
		label: 'Tên',
		type: 'text' as const,
		required: true,
		placeholder: 'Nhập tên giáo viên',
	},
	{
		name: 'email',
		label: 'Email',
		type: 'email' as const,
		required: true,
		placeholder: 'Nhập email',
	},
	{ name: 'phone', label: 'Số điện thoại', type: 'text' as const, required: false },
	{ name: 'department', label: 'Phòng ban', type: 'text' as const, required: false },
	{
		name: 'subjects',
		label: 'Môn dạy (JSON)',
		type: 'textarea' as const,
		required: false,
		placeholder: '["Toán", "Lý"]',
	},
	{
		name: 'status',
		label: 'Trạng thái',
		type: 'select' as const,
		required: true,
		options: [
			{ label: 'Đang dạy', value: 'active' },
			{ label: 'Nghỉ phép', value: 'on-leave' },
			{ label: 'Nghỉ việc', value: 'inactive' },
		],
	},
	{ name: 'joining_date', label: 'Ngày vào', type: 'date' as const, required: false },
	{ name: 'avatar', label: 'Avatar URL', type: 'text' as const, required: false },
	{ name: 'address', label: 'Địa chỉ', type: 'textarea' as const, required: false },
	{ name: 'qualification', label: 'Bằng cấp', type: 'text' as const, required: false },
	{ name: 'experience', label: 'Kinh nghiệm (năm)', type: 'number' as const, required: false },
	{ name: 'salary', label: 'Lương', type: 'number' as const, required: false },
	{
		name: 'classes',
		label: 'Lớp dạy (JSON)',
		type: 'textarea' as const,
		required: false,
		placeholder: '["10A", "11B"]',
	},
	{
		name: 'schedule',
		label: 'Lịch dạy (JSON)',
		type: 'textarea' as const,
		required: false,
		placeholder: '[{"day":"Monday","time":"9:00-10:00","subject":"Toán","class":"10A"}]',
	},
];

export default function TeachersAdminPage() {
	const [data, setData] = useState<Teacher[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/admin/teachers');
			if (response.ok) {
				const result = await response.json();
				setData(result);
			}
		} catch (error) {
			console.error('Error fetching teachers:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleCreate = async (values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/teachers', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values),
		});
		if (!response.ok) throw new Error('Failed to create teacher');
	};

	const handleUpdate = async (id: string, values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/teachers', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, ...values }),
		});
		if (!response.ok) throw new Error('Failed to update teacher');
	};

	const handleDelete = async (id: string) => {
		const response = await fetch(`/api/admin/teachers?id=${id}`, { method: 'DELETE' });
		if (!response.ok) throw new Error('Failed to delete teacher');
	};

	return (
		<AdminTable
			displayName="Giáo viên"
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
