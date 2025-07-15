'use client';

import { useState, useEffect } from 'react';
import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminTable from '@/components/admin/AdminTable';

interface Attendance {
	id: string;
	student_id: string;
	date: string;
	status: 'present' | 'absent' | 'late' | 'excused';
	reason?: string;
	arrival_time?: string;
	created: string;
	updated: string;
}

const columns: ColumnsType<Attendance> = [
	{ title: 'ID Học sinh', dataIndex: 'student_id', key: 'student_id', width: 150 },
	{
		title: 'Ngày',
		dataIndex: 'date',
		key: 'date',
		width: 120,
		render: (date: string) => (date ? new Date(date).toLocaleDateString('vi-VN') : ''),
	},
	{
		title: 'Trạng thái',
		dataIndex: 'status',
		key: 'status',
		width: 100,
		render: (status: string) => {
			const color =
				status === 'present'
					? 'green'
					: status === 'late'
						? 'orange'
						: status === 'excused'
							? 'blue'
							: 'red';
			return <Tag color={color}>{status.toUpperCase()}</Tag>;
		},
	},
	{ title: 'Giờ đến', dataIndex: 'arrival_time', key: 'arrival_time', width: 100 },
	{ title: 'Lý do', dataIndex: 'reason', key: 'reason', width: 200 },
];

const formFields = [
	{
		name: 'student_id',
		label: 'ID Học sinh',
		type: 'text' as const,
		required: true,
		placeholder: 'Nhập ID học sinh',
	},
	{ name: 'date', label: 'Ngày', type: 'date' as const, required: true },
	{
		name: 'status',
		label: 'Trạng thái',
		type: 'select' as const,
		required: true,
		options: [
			{ label: 'Có mặt', value: 'present' },
			{ label: 'Vắng', value: 'absent' },
			{ label: 'Đi muộn', value: 'late' },
			{ label: 'Có phép', value: 'excused' },
		],
	},
	{
		name: 'arrival_time',
		label: 'Giờ đến',
		type: 'text' as const,
		required: false,
		placeholder: 'VD: 8:55',
	},
	{ name: 'reason', label: 'Lý do', type: 'textarea' as const, required: false },
];

export default function AttendanceAdminPage() {
	const [data, setData] = useState<Attendance[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/admin/attendance');
			if (response.ok) {
				const result = await response.json();
				setData(result);
			}
		} catch (error) {
			console.error('Error fetching attendance:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleCreate = async (values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/attendance', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values),
		});
		if (!response.ok) throw new Error('Failed to create attendance record');
	};

	const handleUpdate = async (id: string, values: Record<string, unknown>) => {
		const response = await fetch('/api/admin/attendance', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, ...values }),
		});
		if (!response.ok) throw new Error('Failed to update attendance record');
	};

	const handleDelete = async (id: string) => {
		const response = await fetch(`/api/admin/attendance?id=${id}`, { method: 'DELETE' });
		if (!response.ok) throw new Error('Failed to delete attendance record');
	};

	return (
		<AdminTable
			displayName="Điểm danh"
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
