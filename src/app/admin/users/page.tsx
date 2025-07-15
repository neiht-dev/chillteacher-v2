'use client';

import { useState, useEffect } from 'react';
import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminTable from '@/components/admin/AdminTable';

interface User {
	id: string;
	name: string;
	display_name: string;
	email: string;
	email_verified: boolean;
	status: 'active' | 'pending' | 'suspended';
	role: 'guest' | 'user' | 'admin';
	avatar_url?: string;
	last_login?: string;
	membership: 'free' | 'premium' | 'trial';
	gender: 'male' | 'female' | 'other';
	date_of_birth?: string;
	phone?: string;
	bio?: string;
	created: string;
	updated: string;
}

const columns: ColumnsType<User> = [
	{
		title: 'Tên',
		dataIndex: 'name',
		key: 'name',
		width: 150,
	},
	{
		title: 'Tên hiển thị',
		dataIndex: 'display_name',
		key: 'display_name',
		width: 150,
	},
	{
		title: 'Email',
		dataIndex: 'email',
		key: 'email',
		width: 200,
	},
	{
		title: 'Vai trò',
		dataIndex: 'role',
		key: 'role',
		width: 100,
		render: (role: string) => {
			const color = role === 'admin' ? 'red' : role === 'user' ? 'blue' : 'default';
			return <Tag color={color}>{role.toUpperCase()}</Tag>;
		},
	},
	{
		title: 'Trạng thái',
		dataIndex: 'status',
		key: 'status',
		width: 100,
		render: (status: string) => {
			const color = status === 'active' ? 'green' : status === 'pending' ? 'orange' : 'red';
			return <Tag color={color}>{status.toUpperCase()}</Tag>;
		},
	},
	{
		title: 'Thành viên',
		dataIndex: 'membership',
		key: 'membership',
		width: 100,
		render: (membership: string) => {
			const color = membership === 'premium' ? 'gold' : membership === 'trial' ? 'blue' : 'default';
			return <Tag color={color}>{membership.toUpperCase()}</Tag>;
		},
	},
	{
		title: 'Giới tính',
		dataIndex: 'gender',
		key: 'gender',
		width: 80,
		render: (gender: string) => {
			const color = gender === 'male' ? 'blue' : gender === 'female' ? 'pink' : 'default';
			return <Tag color={color}>{gender.toUpperCase()}</Tag>;
		},
	},
	{
		title: 'Điện thoại',
		dataIndex: 'phone',
		key: 'phone',
		width: 120,
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
		label: 'Tên',
		type: 'text' as const,
		required: true,
		placeholder: 'Nhập tên người dùng',
	},
	{
		name: 'display_name',
		label: 'Tên hiển thị',
		type: 'text' as const,
		required: true,
		placeholder: 'Nhập tên hiển thị',
	},
	{
		name: 'email',
		label: 'Email',
		type: 'email' as const,
		required: true,
		placeholder: 'Nhập email',
	},
	{
		name: 'password_hash',
		label: 'Mật khẩu',
		type: 'password' as const,
		required: true,
		placeholder: 'Nhập mật khẩu',
	},
	{
		name: 'role',
		label: 'Vai trò',
		type: 'select' as const,
		required: true,
		options: [
			{ label: 'Khách', value: 'guest' },
			{ label: 'Người dùng', value: 'user' },
			{ label: 'Admin', value: 'admin' },
		],
	},
	{
		name: 'status',
		label: 'Trạng thái',
		type: 'select' as const,
		required: true,
		options: [
			{ label: 'Hoạt động', value: 'active' },
			{ label: 'Chờ xác nhận', value: 'pending' },
			{ label: 'Tạm khóa', value: 'suspended' },
		],
	},
	{
		name: 'membership',
		label: 'Thành viên',
		type: 'select' as const,
		required: true,
		options: [
			{ label: 'Miễn phí', value: 'free' },
			{ label: 'Premium', value: 'premium' },
			{ label: 'Dùng thử', value: 'trial' },
		],
	},
	{
		name: 'gender',
		label: 'Giới tính',
		type: 'select' as const,
		required: true,
		options: [
			{ label: 'Nam', value: 'male' },
			{ label: 'Nữ', value: 'female' },
			{ label: 'Khác', value: 'other' },
		],
	},
	{
		name: 'date_of_birth',
		label: 'Ngày sinh',
		type: 'date' as const,
		required: false,
	},
	{
		name: 'phone',
		label: 'Điện thoại',
		type: 'text' as const,
		required: false,
		placeholder: 'Nhập số điện thoại',
	},
	{
		name: 'bio',
		label: 'Tiểu sử',
		type: 'textarea' as const,
		required: false,
		placeholder: 'Nhập tiểu sử',
	},
	{
		name: 'avatar_url',
		label: 'URL Avatar',
		type: 'text' as const,
		required: false,
		placeholder: 'Nhập URL avatar',
	},
];

export default function UsersAdminPage() {
	const [data, setData] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/admin/users');
			if (response.ok) {
				const result = await response.json();
				setData(result);
			}
		} catch (error) {
			console.error('Error fetching users:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleCreate = async (values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(values),
		});

		if (!response.ok) {
			throw new Error('Failed to create user');
		}
	};

	const handleUpdate = async (id: string, values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/users', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id, ...values }),
		});

		if (!response.ok) {
			throw new Error('Failed to update user');
		}
	};

	const handleDelete = async (id: string) => {
		const response = await fetch(`/api/admin/users?id=${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error('Failed to delete user');
		}
	};

	return (
		<AdminTable
			displayName="Người dùng"
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
