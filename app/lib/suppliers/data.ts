import { sql } from '@vercel/postgres';
import { Supplier, SuppliersField } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 6;

// Função para buscar fornecedores filtrados
export async function fetchFilteredSuppliers(query: string, currentPage: number): Promise<Supplier[]> {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<Supplier>`
      SELECT
        id,
        name,
        contact_name,
        phone,
        email,
        address,
        created_at,
        updated_at
      FROM suppliers
      WHERE 
        name ILIKE ${'%' + query + '%'}
        OR contact_name ILIKE ${'%' + query + '%'}
        OR email ILIKE ${'%' + query + '%'}
        OR address ILIKE ${'%' + query + '%'}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch suppliers.');
  }
}

// Função para buscar o número total de páginas de fornecedores
export async function fetchSuppliersPages(query: string): Promise<number> {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM suppliers
      WHERE 
        name ILIKE ${'%' + query + '%'}
        OR contact_name ILIKE ${'%' + query + '%'}
        OR email ILIKE ${'%' + query + '%'}
        OR address ILIKE ${'%' + query + '%'}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of suppliers.');
  }
}

// Função para buscar um fornecedor pelo ID
export async function fetchSupplierById(id: string): Promise<Supplier | null> {
  try {
    const data = await sql<Supplier>`
      SELECT
        id,
        name,
        contact_name,
        phone,
        email,
        address,
        created_at,
        updated_at
      FROM suppliers
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

// Função para buscar todos os fornecedores
export async function fetchSuppliers() {
  noStore();
  try {
    const data = await sql<SuppliersField>`
      SELECT
        id,
        name
      FROM suppliers
      ORDER BY name ASC
    `;

    const suppliers = data.rows;
    return suppliers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all suppliers.');
  }
}