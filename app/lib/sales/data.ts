import { sql } from '@vercel/postgres';
import { Sale } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 6;

// Function to fetch filtered sales
export async function fetchFilteredSales(query: string, currentPage: number): Promise<Sale[]> {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<Sale>`
      SELECT
        id,
        customer_id AS "customerId",
        vehicle_id AS "vehicleId",
        total,
        status,
        sale_code AS "saleCode",
        created_at AS "createdAt"
      FROM sales
      WHERE 
        total::text ILIKE ${'%' + query + '%'}
        OR status ILIKE ${'%' + query + '%'}
        OR sale_code ILIKE ${'%' + query + '%'}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch sales.');
  }
}

// Function to fetch the total number of sales pages
export async function fetchSalesPages(query: string): Promise<number> {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM sales
      WHERE 
        total::text ILIKE ${'%' + query + '%'}
        OR status ILIKE ${'%' + query + '%'}
        OR sale_code ILIKE ${'%' + query + '%'}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of sales.');
  }
}

// Function to fetch a sale by ID
export async function fetchSaleById(id: string): Promise<Sale | null> {
  try {
    const data = await sql<Sale>`
      SELECT
        id,
        customer_id AS "customerId",
        vehicle_id AS "vehicleId",
        total,
        status,
        sale_code AS "saleCode",
        created_at AS "createdAt"
      FROM sales
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

// Function to fetch all sales
export async function fetchSales(): Promise<Sale[]> {
  noStore();
  try {
    const data = await sql<Sale>`
      SELECT
        id,
        customer_id AS "customerId",
        vehicle_id AS "vehicleId",
        total,
        status,
        sale_code AS "saleCode",
        created_at AS "createdAt"
      FROM sales
      ORDER BY created_at DESC
    `;

    const sales = data.rows;
    return sales;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all sales.');
  }
}
