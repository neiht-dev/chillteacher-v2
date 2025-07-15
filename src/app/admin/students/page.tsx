'use client';

import { useState, useEffect } from 'react';
import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminTable from '@/components/admin/AdminTable';

interface Student {
	id: string;
	name: string;
	email: string;
	phone: string;
	class: string;
	grade: string;
	status: 'active' | 'inactive' | 'graduated';
	enrollment_date: string;
	avatar?: string;
	address?: string;
	parent_name?: string;
	parent_phone?: string;
	tuition_fee?: number;
	tuition_status: 'paid' | 'pending' | 'overdue';
	created: string;
	updated: string;
}

const columns: ColumnsType<Student> = [
	{
		title: 'Tên',
		dataIndex: 'name',
		key: 'name',
		width: 150,
	},
	{
		title: 'Email',
		dataIndex: 'email',
		key: 'email',
		width: 200,
	},
	{
		title: 'Lớp',
		dataIndex: 'class',
		key: 'class',
		width: 80,
	},
	{
		title: 'Xếp loại',
		dataIndex: 'grade',
		key: 'grade',
		width: 80,
	},
	{
		title: 'Trạng thái',
		dataIndex: 'status',
		key: 'status',
		width: 100,
		render: (status: string) => {
			const color = status === 'active' ? 'green' : status === 'graduated' ? 'blue' : 'orange';
			return <Tag color={color}>{status.toUpperCase()}</Tag>;
		},
	},
	{
		title: 'Ngày nhập học',
		dataIndex: 'enrollment_date',
		key: 'enrollment_date',
		width: 120,
		render: (date: string) => (date ? new Date(date).toLocaleDateString('vi-VN') : ''),
	},
	{
		title: 'Học phí',
		dataIndex: 'tuition_fee',
		key: 'tuition_fee',
		width: 100,
	},
	{
		title: 'Trạng thái học phí',
		dataIndex: 'tuition_status',
		key: 'tuition_status',
		width: 120,
		render: (status: string) => {
			const color = status === 'paid' ? 'green' : status === 'pending' ? 'orange' : 'red';
			return <Tag color={color}>{status.toUpperCase()}</Tag>;
		},
	},
];

const formFields = [
	{
		name: 'name',
		label: 'Tên',
		type: 'text' as const,
		required: true,
		placeholder: 'Nhập tên học sinh',
	},
	{
		name: 'email',
		label: 'Email',
		type: 'email' as const,
		required: true,
		placeholder: 'Nhập email',
	},
	{ name: 'phone', label: 'Số điện thoại', type: 'text' as const, required: false },
	{ name: 'class', label: 'Lớp', type: 'text' as const, required: false },
	{ name: 'grade', label: 'Xếp loại', type: 'text' as const, required: false },
	{
		name: 'status',
		label: 'Trạng thái',
		type: 'select' as const,
		required: true,
		options: [
			{ label: 'Đang học', value: 'active' },
			{ label: 'Đã tốt nghiệp', value: 'graduated' },
			{ label: 'Nghỉ học', value: 'inactive' },
		],
	},
	{ name: 'enrollment_date', label: 'Ngày nhập học', type: 'date' as const, required: false },
	{ name: 'avatar', label: 'Avatar URL', type: 'text' as const, required: false },
	{ name: 'address', label: 'Địa chỉ', type: 'textarea' as const, required: false },
	{ name: 'parent_name', label: 'Tên phụ huynh', type: 'text' as const, required: false },
	{ name: 'parent_phone', label: 'SĐT phụ huynh', type: 'text' as const, required: false },
	{ name: 'tuition_fee', label: 'Học phí', type: 'number' as const, required: false },
	{
		name: 'tuition_status',
		label: 'Trạng thái học phí',
		type: 'select' as const,
		required: true,
		options: [
			{ label: 'Đã đóng', value: 'paid' },
			{ label: 'Chưa đóng', value: 'pending' },
			{ label: 'Nợ', value: 'overdue' },
		],
	},
];

export default function StudentsAdminPage() {
	const [data, setData] = useState<Student[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/admin/students');
			if (response.ok) {
				const result = await response.json();
				setData(result);
			}
		} catch (error) {
			console.error('Error fetching students:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleCreate = async (values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/students', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values),
		});
		if (!response.ok) throw new Error('Failed to create student');
	};

	const handleUpdate = async (id: string, values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/students', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, ...values }),
		});
		if (!response.ok) throw new Error('Failed to update student');
	};

	const handleDelete = async (id: string) => {
		const response = await fetch(`/api/admin/students?id=${id}`, { method: 'DELETE' });
		if (!response.ok) throw new Error('Failed to delete student');
	};

	return (
		<AdminTable
			displayName="Học sinh/Sinh viên"
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
