import { sql } from '@vercel/postgres';
import { Part } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredParts(query: string, currentPage: number): Promise<Part[]> {
  noStore(); // Desabilita o armazenamento em cache para esta função
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<Part>`
      SELECT
        id,
        description,
        oem_number AS "oemNumber",
        part_number AS "partNumber",
        brand,
        unit_of_measurement AS "unitOfMeasurement",
        unit_price AS "unitPrice",
        quantity,
        company_id AS "companyId",
        product_url AS "productUrl"
      FROM parts
      WHERE 
        description ILIKE ${'%' + query + '%'}
        OR oem_number ILIKE ${'%' + query + '%'}
        OR part_number ILIKE ${'%' + query + '%'}
        OR brand ILIKE ${'%' + query + '%'}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch parts.');
  }
}

export async function fetchPartsPages(query: string): Promise<number> {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM parts
      WHERE 
        description ILIKE ${'%' + query + '%'}
        OR oem_number ILIKE ${'%' + query + '%'}
        OR part_number ILIKE ${'%' + query + '%'}
        OR brand ILIKE ${'%' + query + '%'}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of parts.');
  }
}

export async function fetchPartById(id: string): Promise<Part | null> {
  try {
    const data = await sql<Part>`
      SELECT
        id,
        description,
        oem_number AS "oemNumber",
        part_number AS "partNumber",
        brand,
        unit_of_measurement AS "unitOfMeasurement",
        unit_price AS "unitPrice",
        quantity,
        company_id AS "companyId",
        product_url AS "productUrl",
        image_urls AS "imageUrls"
      FROM parts
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


export async function fetchParts(): Promise<Part[]> {
  noStore();

  try {
    const data = await sql<Part>`
      SELECT
        id,
        description,
        brand,
        product_url
      FROM parts
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch parts.');
  }
}