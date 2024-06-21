import { sql } from '@vercel/postgres';
import { Customer } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredCustomers(query: string, currentPage: number): Promise<Customer[]> {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<Customer>`
      SELECT
        id,
        name,
        email,
        phone,
        address,
        status,
        vehicle_plate,
        descriptions,
        date_of_birth,
        created_at,
        updated_at
      FROM customers
      WHERE 
        name ILIKE ${'%' + query + '%'}
        OR email ILIKE ${'%' + query + '%'}
        OR status ILIKE ${'%' + query + '%'}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    if (data.rows.length === 0) {
      throw new Error('No customers found.');
    }

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customers.');
  }
}

export async function fetchCustomersPages(query: string): Promise<number> {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM customers
      WHERE 
        name ILIKE ${'%' + query + '%'}
        OR email ILIKE ${'%' + query + '%'}
        OR status ILIKE ${'%' + query + '%'}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}

export async function fetchCustomerById(id: string): Promise<Customer | null> {
  try {
    const data = await sql<Customer>`
      SELECT
        id,
        name,
        email,
        phone,
        address,
        status,
        vehicle_plate,
        descriptions,
        date_of_birth,
        created_at,
        updated_at
      FROM customers
      WHERE id = ${id};
    `;

    if (data.rows.length === 0) {
      return null;
    }

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}