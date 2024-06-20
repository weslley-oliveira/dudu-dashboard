import { sql } from '@vercel/postgres';
import { Category } from '../categories/definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { Vehicle } from '../definitions';

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredCategories(query: string, currentPage: number): Promise<Category[]> {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    console.log(`Executing SQL: SELECT id, category_name, description FROM categories WHERE category_name ILIKE '%${query}%' LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`);

    const data = await sql<Category>`
      SELECT 
        id, 
        category_name, 
        description
      FROM categories
      WHERE category_name ILIKE ${'%' + query + '%'}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    if (data.rows.length === 0) {
      console.warn('No categories found.');
      return [];
    }

    console.log('Categories fetched successfully:', data.rows);
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}

export async function fetchCategoriesPages(query: string): Promise<number> {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM categories
      WHERE 
        category_name ILIKE ${'%' + query + '%'}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of categories.');
  }
}

export async function fetchCategoryById(id: string): Promise<Category | null> {
  noStore();
  try {
    const data = await sql<Category>`
      SELECT id, category_name, description
      FROM categories
      WHERE id = ${id}
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

export async function fetchVehicleById(id: string): Promise<Vehicle> {
  noStore();
  try {
    const data = await sql<Vehicle>`
      SELECT
        id,
        plate,
        make,
        type,
        series,
        mileage,
        observations,
        model,
        engine_capacity,
        vin,
        engine_number,
        fuel_type,
        status,
        company_id,
        year_of_manufacture,
        mot,
        tracker,
        tracker_observation,
        color
      FROM vehicles
      WHERE id = ${id};
    `;

    if (data.rows.length === 0) {
      throw new Error('Vehicle not found.');
    }

    const vehicle = data.rows.map((vehicle) => ({
      ...vehicle
    }));

    return vehicle[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vehicle.');
  }
}
