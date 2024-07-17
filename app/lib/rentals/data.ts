import { sql } from '@vercel/postgres';
import { Rental } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 6;

// Função para buscar rentals filtrados
export async function fetchFilteredRentals(query: string, currentPage: number): Promise<Rental[]> {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<Rental>`
      SELECT
        id,
        customer_id AS "customerId",
        vehicle_id AS "vehicleId",
        start_date AS "startDate",
        end_date AS "endDate",
        total,
        daypayment,
        created_at AS "createdAt"
      FROM rentals
      WHERE 
        start_date::text ILIKE ${'%' + query + '%'}
        OR end_date::text ILIKE ${'%' + query + '%'}
        OR total::text ILIKE ${'%' + query + '%'}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch rentals.');
  }
}

// Função para buscar o número total de páginas de rentals
export async function fetchRentalsPages(query: string): Promise<number> {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM rentals
      WHERE 
        start_date::text ILIKE ${'%' + query + '%'}
        OR end_date::text ILIKE ${'%' + query + '%'}
        OR total::text ILIKE ${'%' + query + '%'}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of rentals.');
  }
}

// Função para buscar um rental pelo ID
export async function fetchRentalById(id: string): Promise<Rental | null> {
  noStore();
  try {
    const data = await sql<Rental>`
      SELECT
        id,
        customer_id AS "customerId",
        vehicle_id AS "vehicleId",
        start_date AS "startDate",
        end_date AS "endDate",
        total,
        daypayment,
        created_at AS "createdAt"
      FROM rentals
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

// Função para buscar todos os rentals
export async function fetchRentals(): Promise<Rental[]> {
  noStore();
  try {
    const data = await sql<Rental>`
      SELECT
        id,
        customer_id AS "customerId",
        vehicle_id AS "vehicleId",
        start_date AS "startDate",
        end_date AS "endDate",
        total,
        daypayment,
        created_at AS "createdAt"
      FROM rentals
      ORDER BY created_at DESC
    `;

    const rentals = data.rows;
    return rentals;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all rentals.');
  }
}