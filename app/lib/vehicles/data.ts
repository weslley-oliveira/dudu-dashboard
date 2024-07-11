import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { Vehicle } from './definitions';

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredVehicles(query: string, currentPage: number): Promise<Vehicle[]> {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

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
        power,
        transmission,
        vin,
        engine_number,
        fuel_type,
        status,
        company_id,
        year_of_manufacture,
        year_registration,
        mot,
        tracker,
        tracker_observation,
        sale_price,
        rental_price,
        document_status,
        insurance_status,
        maintenance_status,
        color,
        created_at,
        updated_at
      FROM vehicles
      WHERE plate ILIKE ${'%' + query + '%'}
        OR make ILIKE ${'%' + query + '%'}
        OR model ILIKE ${'%' + query + '%'}
        OR type ILIKE ${'%' + query + '%'}
        OR vin ILIKE ${'%' + query + '%'}
        OR status ILIKE ${'%' + query + '%'}
        OR engine_number ILIKE ${'%' + query + '%'}
      ORDER BY created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    if (data.rows.length === 0) {
      console.warn('No vehicles found.');
      return [];
    }

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vehicles.');
  }
}

export async function fetchVehiclesPages(query: string): Promise<number> {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM vehicles
      WHERE plate ILIKE ${'%' + query + '%'}
        OR make ILIKE ${'%' + query + '%'}
        OR model ILIKE ${'%' + query + '%'}
        OR type ILIKE ${'%' + query + '%'}
        OR vin ILIKE ${'%' + query + '%'}
        OR engine_number ILIKE ${'%' + query + '%'}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of vehicles.');
  }
}

export async function fetchVehicleById(id: string): Promise<Vehicle | null> {
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
        power,
        transmission,
        vin,
        engine_number,
        fuel_type,
        status,
        company_id,
        year_of_manufacture,
        year_registration,
        mot,
        tracker,
        tracker_observation,
        sale_price,
        rental_price,
        document_status,
        insurance_status,
        maintenance_status,
        color,
        created_at,
        updated_at
      FROM vehicles
      WHERE id = ${id};
    `;

    if (data.rows.length === 0) {
      throw new Error('Vehicle not found.');
    }

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vehicle.');
  }
}

export async function fetchVehicles(): Promise<Vehicle[]> {
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
        power,
        transmission,
        vin,
        engine_number,
        fuel_type,
        status,
        company_id,
        year_of_manufacture,
        year_registration,
        mot,
        tracker,
        tracker_observation,
        sale_price,
        rental_price,
        document_status,
        insurance_status,
        maintenance_status,
        color,
        created_at,
        updated_at
      FROM vehicles
      ORDER BY created_at DESC
    `;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vehicles.');
  }
}

export const fetchVehicleData = async (vehicleId: string) => {
  const response = await fetch(`/api/get-vehicle-data?vehicleId=${vehicleId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch vehicle data');
  }
  return response.json();
};