import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Invalid query parameter' }, { status: 400 });
  }

  try {
    const data = await sql<User>`
      SELECT
        id,
        username,
        full_name,
        email,
        user_type,
        avatar_url,
        phone,
        status
      FROM users
      WHERE 
        username ILIKE ${'%' + query + '%'}
        OR full_name ILIKE ${'%' + query + '%'}
        OR email ILIKE ${'%' + query + '%'}
        OR user_type ILIKE ${'%' + query + '%'}
        OR status ILIKE ${'%' + query + '%'}
        OR phone ILIKE ${'%' + query + '%'};
    `;

    if (data.rows.length === 0) {
      return NextResponse.json({ error: 'No users found' }, { status: 404 });
    }

    return NextResponse.json(data.rows, { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

 // Supondo que você tenha uma função para hash de senhas

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, email, full_name, user_type, avatar_url, phone } = body;

    if (!username || !password || !email || !full_name || !user_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password); // Função para hashear a senha

    // Inserir dados no banco de dados
    try {
      await sql`
        INSERT INTO users (username, password_hash, email, full_name, user_type, avatar_url, phone)
        VALUES (${username}, ${hashedPassword}, ${email}, ${full_name}, ${user_type}, ${avatar_url}, ${phone})
      `;
      return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
      console.error('Database Error:', error);
      return NextResponse.json({ error: 'Database Error: Failed to create user' }, { status: 500 });
    }
  } catch (error) {
    console.error('Request Error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
