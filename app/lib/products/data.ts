import { sql } from '@vercel/postgres';
import { CategoryField, Product } from '../products/definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { Part } from '../parts/definitions';

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredProducts(query: string, currentPage: number): Promise<Product[]> {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<Product>`
      SELECT
        id,
        product_name,
        product_code,
        category,
        manufacturer,
        price,
        stock,
        status,
        observations
      FROM products
      WHERE 
        product_name ILIKE ${'%' + query + '%'}
        OR product_code ILIKE ${'%' + query + '%'}
        OR category ILIKE ${'%' + query + '%'}
        OR manufacturer ILIKE ${'%' + query + '%'}
        OR status ILIKE ${'%' + query + '%'}
        OR observations ILIKE ${'%' + query + '%'}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    if (data.rows.length === 0) {
      throw new Error('No products found.');
    }

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchProductsPages(query: string): Promise<number> {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM products
      WHERE 
        product_name ILIKE ${'%' + query + '%'}
        OR product_code ILIKE ${'%' + query + '%'}
        OR category ILIKE ${'%' + query + '%'}
        OR manufacturer ILIKE ${'%' + query + '%'}
        OR status ILIKE ${'%' + query + '%'}
        OR observations ILIKE ${'%' + query + '%'}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of products.');
  }
}

export async function fetchProductById(id: string): Promise<Product> {
  noStore();
  try {
    const data = await sql<Product>`
      SELECT
        id,
        product_name,
        product_code,
        category,
        manufacturer,
        price,
        stock,
        status,
        observations
      FROM products
      WHERE id = ${id};
    `;

    if (data.rows.length === 0) {
      throw new Error('Product not found.');
    }

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

export async function fetchCategories() {
  noStore();
  try {
    const data = await sql<CategoryField>`
      SELECT
        id,
        category_name
      FROM categories
      ORDER BY category_name ASC;
    `;

    return data.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch categories.');
  }
}

export async function fetchProducts(): Promise<Product[]> {
  noStore();

  try {
    const data = await sql<Product>`
      SELECT
        id,
        product_name,
        product_code,
        category,
        manufacturer,
        price,
        stock,
        status,
        observations
      FROM products
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}