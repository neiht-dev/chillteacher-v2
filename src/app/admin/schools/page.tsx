'use client';

import { useState, useEffect } from 'react';
import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminTable from '@/components/admin/AdminTable';

interface School {
	id: string;
	name: string;
	address: string;
	email: string;
	phone: string;
	type: 'Public' | 'Private';
	status: 'Active' | 'Inactive';
	created: string;
	updated: string;
}

const columns: ColumnsType<School> = [
	{ title: 'Tên trường', dataIndex: 'name', key: 'name', width: 200 },
	{ title: 'Địa chỉ', dataIndex: 'address', key: 'address', width: 250 },
	{ title: 'Email', dataIndex: 'email', key: 'email', width: 180 },
	{ title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: 120 },
	{
		title: 'Loại',
		dataIndex: 'type',
		key: 'type',
		width: 100,
		render: (type: string) => <Tag color={type === 'Public' ? 'blue' : 'gold'}>{type}</Tag>,
	},
	{
		title: 'Trạng thái',
		dataIndex: 'status',
		key: 'status',
		width: 100,
		render: (status: string) => (
			<Tag color={status === 'Active' ? 'green' : 'orange'}>{status}</Tag>
		),
	},
];

const formFields = [
	{
		name: 'name',
		label: 'Tên trường',
		type: 'text' as const,
		required: true,
		placeholder: 'Nhập tên trường',
	},
	{
		name: 'address',
		label: 'Địa chỉ',
		type: 'textarea' as const,
		required: true,
		placeholder: 'Nhập địa chỉ',
	},
	{
		name: 'email',
		label: 'Email',
		type: 'email' as const,
		required: true,
		placeholder: 'Nhập email',
	},
	{
		name: 'phone',
		label: 'Số điện thoại',
		type: 'text' as const,
		required: true,
		placeholder: 'Nhập số điện thoại',
	},
	{
		name: 'type',
		label: 'Loại trường',
		type: 'select' as const,
		required: true,
		options: [
			{ label: 'Công lập', value: 'Public' },
			{ label: 'Tư thục', value: 'Private' },
		],
	},
	{
		name: 'status',
		label: 'Trạng thái',
		type: 'select' as const,
		required: true,
		options: [
			{ label: 'Đang hoạt động', value: 'Active' },
			{ label: 'Ngừng hoạt động', value: 'Inactive' },
		],
	},
];

export default function SchoolsAdminPage() {
	const [data, setData] = useState<School[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/admin/schools');
			if (response.ok) {
				const result = await response.json();
				setData(result);
			}
		} catch (error) {
			console.error('Error fetching schools:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleCreate = async (values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/schools', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values),
		});
		if (!response.ok) throw new Error('Failed to create school');
	};

	const handleUpdate = async (id: string, values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/schools', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, ...values }),
		});
		if (!response.ok) throw new Error('Failed to update school');
	};

	const handleDelete = async (id: string) => {
		const response = await fetch(`/api/admin/schools?id=${id}`, { method: 'DELETE' });
		if (!response.ok) throw new Error('Failed to delete school');
	};

	return (
		<AdminTable
			displayName="Trường học"
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
