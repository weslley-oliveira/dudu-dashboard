import { sql } from '@vercel/postgres';
import { ItemRequest, ItemRequestsField } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 6;

// Função para buscar item_requests filtrad

export async function fetchFilteredItemRequests(query: string, currentPage: number): Promise<ItemRequest[]> {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<ItemRequest>`
      SELECT
        id,
        mechanic_id,
        item_id,
        item_type,
        quantity,
        status,
        created_at
      FROM item_requests
      WHERE 
        item_id::text ILIKE ${'%' + query + '%'}
        OR item_type ILIKE ${'%' + query + '%'}
        OR status ILIKE ${'%' + query + '%'}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch item requests.');
  }
}
// Função para buscar o número total de páginas de item_requests
export async function fetchItemRequestsPages(query: string): Promise<number> {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM item_requests 
      WHERE 
        item_id::text ILIKE ${'%' + query + '%'}
        OR item_type ILIKE ${'%' + query + '%'}
        OR status ILIKE ${'%' + query + '%'}
    `;

    const totalPages = Math.ceil((Number(count.rows[0]?.count) || 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of item requests.');
  }
}
// Função para buscar um item_request pelo ID
export async function fetchItemRequestById(id: string): Promise<ItemRequest | null> {
  try {
    const data = await sql<ItemRequest>`
      SELECT
        id,
        mechanic_id,
        item_name,
        quantity,
        status,
        created_at
      FROM item_requests
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

// Função para buscar todos os item_requests
export async function fetchItemRequests(): Promise<ItemRequestsField[]> {
  noStore();
  try {
    const data = await sql<ItemRequestsField>`
      SELECT
        id,
        item_name
      FROM item_requests
      ORDER BY created_at ASC
    `;

    const itemRequests = data.rows;
    return itemRequests;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all item requests.');
  }
}