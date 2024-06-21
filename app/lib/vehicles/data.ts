import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { Vehicle } from '../vehicles/definitions';

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
        OR engine_number ILIKE ${'%' + query + '%'}
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

export const fetchVehicleData = async (plate: string): Promise<Vehicle> => {
  const apiKey = '06a0f54d-44ea-404b-8978-7f519f4f4534';
  const url = `https://uk1.ukvehicledata.co.uk/api/datapackage/VehicleAndMotHistory?v=2&api_nullitems=1&auth_apikey=${apiKey}&key_VRM=${plate}`;
  const response = await fetch(url);
  const data = await response.json();

  console.log(response, "Ta aqui de verdade");

  return {
    id: '', // O ID será gerado pelo banco de dados
    plate: data.Request.DataKeys.Vrm,
    make: data.Response.DataItems.VehicleRegistration.Make,
    model: data.Response.DataItems.SmmtDetails.ModelVariant,
    series: data.Response.DataItems.SmmtDetails.Series,
    type: data.Response.DataItems.VehicleRegistration.VehicleClass || '',
    year_of_manufacture: parseInt(data.Response.DataItems.VehicleRegistration.YearOfManufacture),
    year_registration: data.Response.DataItems.VehicleRegistration.YearOfFirstRegistration,
    specs: {
      engine_capacity: data.Response.DataItems.VehicleRegistration.EngineCapacity,
      power: '',
      mileage: 0,
      transmission: '',
      fuel_type: data.Response.DataItems.VehicleRegistration.FuelType,
      color: data.Response.DataItems.VehicleRegistration.Colour,
    },
    vin: data.Response.DataItems.VehicleRegistration.Vin,
    engine_number: data.Response.DataItems.VehicleRegistration.EngineNumber,
    status: '',
    price: {
      sale_price: '',
      rental_price: '',
    },
    document_status: '',
    insurance_status: '',
    maintenance_status: '',
    mot: '',
    tracker: false,
    tracker_observation: '',
    observations: '',
    company_id: '',
    created_at: '',
    updated_at: '',
  };
};
