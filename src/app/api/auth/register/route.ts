
import { NextResponse } from 'next/server';
import { db } from '@/db/db-init';
import { users } from '@/db/models/users';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = z
      .object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      })
      .safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { name, email, password } = parsedBody.data;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await db
      .insert(users)
      .values({
        name,
        display_name: name,
        email,
        password_hash: hashedPassword,
      })
      .returning();

    return NextResponse.json(newUser[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
