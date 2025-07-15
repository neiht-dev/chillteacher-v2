'use client';

import { useState, useEffect } from 'react';
import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminTable from '@/components/admin/AdminTable';

interface Course {
	id: string;
	name: string;
	description?: string;
	code: string;
	credits: number;
	duration: number;
	is_active: boolean;
	created: string;
	updated: string;
}

const columns: ColumnsType<Course> = [
	{
		title: 'Mã khóa học',
		dataIndex: 'code',
		key: 'code',
		width: 120,
	},
	{
		title: 'Tên khóa học',
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
		title: 'Tín chỉ',
		dataIndex: 'credits',
		key: 'credits',
		width: 80,
	},
	{
		title: 'Thời lượng (phút)',
		dataIndex: 'duration',
		key: 'duration',
		width: 120,
	},
	{
		title: 'Trạng thái',
		dataIndex: 'is_active',
		key: 'is_active',
		width: 100,
		render: (isActive: boolean) => (
			<Tag color={isActive ? 'green' : 'red'}>{isActive ? 'HOẠT ĐỘNG' : 'KHÔNG HOẠT ĐỘNG'}</Tag>
		),
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
		name: 'code',
		label: 'Mã khóa học',
		type: 'text' as const,
		required: true,
		placeholder: 'Nhập mã khóa học',
	},
	{
		name: 'name',
		label: 'Tên khóa học',
		type: 'text' as const,
		required: true,
		placeholder: 'Nhập tên khóa học',
	},
	{
		name: 'description',
		label: 'Mô tả',
		type: 'textarea' as const,
		required: false,
		placeholder: 'Nhập mô tả khóa học',
	},
	{
		name: 'credits',
		label: 'Tín chỉ',
		type: 'number' as const,
		required: true,
		placeholder: 'Nhập số tín chỉ',
	},
	{
		name: 'duration',
		label: 'Thời lượng (phút)',
		type: 'number' as const,
		required: true,
		placeholder: 'Nhập thời lượng',
	},
	{
		name: 'is_active',
		label: 'Trạng thái hoạt động',
		type: 'boolean' as const,
		required: true,
	},
];

export default function CoursesAdminPage() {
	const [data, setData] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/admin/courses');
			if (response.ok) {
				const result = await response.json();
				setData(result);
			}
		} catch (error) {
			console.error('Error fetching courses:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleCreate = async (values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/courses', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(values),
		});

		if (!response.ok) {
			throw new Error('Failed to create course');
		}
	};

	const handleUpdate = async (id: string, values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/courses', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id, ...values }),
		});

		if (!response.ok) {
			throw new Error('Failed to update course');
		}
	};

	const handleDelete = async (id: string) => {
		const response = await fetch(`/api/admin/courses?id=${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error('Failed to delete course');
		}
	};

	return (
		<AdminTable
			displayName="Khóa học"
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
