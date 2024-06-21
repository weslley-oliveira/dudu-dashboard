import { sql } from '@vercel/postgres';
import { User } from '../users/definitions';
import { unstable_noStore as noStore } from 'next/cache';

// Constante para itens por página
const ITEMS_PER_PAGE = 6;

// Função para buscar usuários filtrados
export async function fetchFilteredUsers(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const searchQuery = `%${query}%`;

    const users = await sql<User>`
      SELECT
        users.id,
        users.username,
        users.password_hash,
        users.email,
        users.full_name,
        users.user_type,
        users.avatar_url,
        users.phone
      FROM users
      WHERE
        users.username ILIKE ${searchQuery} OR
        users.email ILIKE ${searchQuery} OR
        users.full_name ILIKE ${searchQuery} OR
        users.user_type ILIKE ${searchQuery} OR
        users.phone ILIKE ${searchQuery}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return users.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}

// Função para buscar a quantidade total de páginas de usuários
export async function fetchUsersPages(query: string) {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM users
      WHERE
        users.username ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        users.full_name ILIKE ${`%${query}%`} OR
        users.user_type ILIKE ${`%${query}%`} OR
        users.phone ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of users.');
  }
}

// Função para buscar usuário por ID
export async function fetchUserById(id: string) {
  noStore();
  try {
    const data = await sql<User>`
      SELECT
        users.id,
        users.username,
        users.password_hash,
        users.email,
        users.full_name,
        users.user_type,
        users.avatar_url,
        users.phone
      FROM users
      WHERE users.id = ${id};
    `;

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}

// Função para buscar usuário por email
export async function getUser(email: string) {
  try {
    const user = await sql`
      SELECT
        users.id,
        users.username,
        users.password_hash,
        users.email,
        users.full_name,
        users.user_type,
        users.avatar_url,
        users.phone
      FROM users
      WHERE email = ${email}
    `;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}