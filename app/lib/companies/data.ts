import { sql } from '@vercel/postgres';
import { Company } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredCompanies(query: string, currentPage: number): Promise<Company[]> {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<Company>`
      SELECT
        id,
        name,
        registration_number,
        vat_number,
        address_street,
        address_number,
        address_complement,
        address_city,
        address_state,
        address_postcode,
        phone,
        email,
        created_at,
        updated_at
      FROM companies
      WHERE 
        name ILIKE ${'%' + query + '%'}
        OR registration_number ILIKE ${'%' + query + '%'}
        OR email ILIKE ${'%' + query + '%'}
        OR address_city ILIKE ${'%' + query + '%'}
        OR address_state ILIKE ${'%' + query + '%'}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    if (data.rows.length === 0) {
      throw new Error('No companies found.');
    }

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch companies.');
  }
}

export async function fetchCompaniesPages(query: string): Promise<number> {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM companies
      WHERE 
        name ILIKE ${'%' + query + '%'}
        OR registration_number ILIKE ${'%' + query + '%'}
        OR email ILIKE ${'%' + query + '%'}
        OR address_city ILIKE ${'%' + query + '%'}
        OR address_state ILIKE ${'%' + query + '%'}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of companies.');
  }
}

export async function fetchCompanyById(id: string): Promise<Company | null> {
  try {
    const data = await sql<Company>`
      SELECT
        id,
        name,
        registration_number,
        vat_number,
        address_street,
        address_number,
        address_complement,
        address_city,
        address_state,
        address_postcode,
        phone,
        email,
        created_at,
        updated_at
      FROM companies
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