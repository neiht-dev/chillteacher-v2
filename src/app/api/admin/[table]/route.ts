import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db-init';
import { users, courses, classes, enrollments } from '@/db/models';
import { eq } from 'drizzle-orm';

const tables = {
	users,
	courses,
	classes,
	enrollments,
};

export async function GET(request: NextRequest, { params }: { params: { table: string } }) {
	try {
		const { table } = params;
		const tableModel = tables[table as keyof typeof tables];

		if (!tableModel) {
			return NextResponse.json({ error: 'Table not found' }, { status: 404 });
		}

		const data = await db.select().from(tableModel);
		return NextResponse.json(data);
	} catch (error) {
		console.error('Error fetching data:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function POST(request: NextRequest, { params }: { params: { table: string } }) {
	try {
		const { table } = params;
		const tableModel = tables[table as keyof typeof tables];

		if (!tableModel) {
			return NextResponse.json({ error: 'Table not found' }, { status: 404 });
		}

		const body = await request.json();

		// Remove id, created, updated, deleted fields from body
		const { id: _id, created: _created, updated: _updated, deleted: _deleted, ...data } = body;

		const result = await db.insert(tableModel).values(data).returning();
		return NextResponse.json(result[0]);
	} catch (error) {
		console.error('Error creating record:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: { params: { table: string } }) {
	try {
		const { table } = params;
		const tableModel = tables[table as keyof typeof tables];

		if (!tableModel) {
			return NextResponse.json({ error: 'Table not found' }, { status: 404 });
		}

		const body = await request.json();
		const { id, created, updated, deleted, ...data } = body;

		if (!id) {
			return NextResponse.json({ error: 'ID is required' }, { status: 400 });
		}

		const result = await db
			.update(tableModel)
			.set({ ...data, updated: new Date() })
			.where(eq(tableModel.id, id))
			.returning();

		if (result.length === 0) {
			return NextResponse.json({ error: 'Record not found' }, { status: 404 });
		}

		return NextResponse.json(result[0]);
	} catch (error) {
		console.error('Error updating record:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: { params: { table: string } }) {
	try {
		const { table } = params;
		const tableModel = tables[table as keyof typeof tables];

		if (!tableModel) {
			return NextResponse.json({ error: 'Table not found' }, { status: 404 });
		}

		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'ID is required' }, { status: 400 });
		}

		const result = await db.delete(tableModel).where(eq(tableModel.id, id)).returning();

		if (result.length === 0) {
			return NextResponse.json({ error: 'Record not found' }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting record:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
