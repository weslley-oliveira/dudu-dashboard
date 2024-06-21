'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Vehicle } from '@/app/lib/vehicles/definitions';
import { toUpperCase } from '../utils';

const FormSchema = z.object({
  id: z.string().uuid().optional(),
  plate: z.string().min(1, { message: 'Plate is required' }),
  make: z.string().min(1, { message: 'Make is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  series: z.string().min(1, { message: 'Series is required' }),
  type: z.string().min(1, { message: 'Type is required' }),
  year_of_manufacture: z.number().int().nonnegative().optional(),
  year_registration: z.string().optional(),
  engine_capacity: z.string().min(1, { message: 'Engine Capacity is required' }),
  power: z.string().optional(),
  mileage: z.number().nonnegative({ message: 'Mileage must be a non-negative number' }).optional(),
  transmission: z.string().optional(),
  fuel_type: z.string().min(1, { message: 'Fuel Type is required' }),
  color: z.string().min(1, { message: 'Color is required' }),
  vin: z.string().min(1, { message: 'VIN is required' }),
  engine_number: z.string().min(1, { message: 'Engine Number is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  sale_price: z.string().optional(),
  rental_price: z.string().optional(),
  document_status: z.string().optional(),
  insurance_status: z.string().optional(),
  maintenance_status: z.string().optional(),
  mot: z.string().optional(),
  tracker: z.boolean().optional(),
  tracker_observation: z.union([z.string(), z.null()]).optional(),
  observations: z.string().optional(),
  company_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

const CreateVehicle = FormSchema.omit({ id: true });
const UpdateVehicle = FormSchema.omit({ id: true }).partial();

// This is temporary
export type State = {
  errors?: {
    plate?: string[];
    make?: string[];
    model?: string[];
    series?: string[];
    type?: string[];
    year_of_manufacture?: string[];
    year_registration?: string[];
    engine_capacity?: string[];
    power?: string[];
    mileage?: string[];
    transmission?: string[];
    fuel_type?: string[];
    color?: string[];
    vin?: string[];
    engine_number?: string[];
    status?: string[];
    sale_price?: string[];
    rental_price?: string[];
    document_status?: string[];
    insurance_status?: string[];
    maintenance_status?: string[];
    mot?: string[];
    tracker?: string[];
    tracker_observation?: string[];
    observations?: string[];
    company_id?: string[];
    created_at?: string[];
    updated_at?: string[];
  };
  message?: string | null;
};

export async function createVehicle(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateVehicle.safeParse({
    plate: formData.get('plate'),
    make: formData.get('make'),
    model: formData.get('model'),
    series: formData.get('series'),
    type: formData.get('type'),
    year_of_manufacture: formData.get('year_of_manufacture') ? Number(formData.get('year_of_manufacture')) : undefined,
    year_registration: formData.get('year_registration'),
    engine_capacity: formData.get('engine_capacity'),
    power: formData.get('power'),
    mileage: formData.get('mileage') ? Number(formData.get('mileage')) : undefined,
    transmission: formData.get('transmission'),
    fuel_type: formData.get('fuel_type'),
    color: formData.get('color'),
    vin: formData.get('vin'),
    engine_number: formData.get('engine_number'),
    status: formData.get('status'),
    sale_price: formData.get('sale_price'),
    rental_price: formData.get('rental_price'),
    document_status: formData.get('document_status'),
    insurance_status: formData.get('insurance_status'),
    maintenance_status: formData.get('maintenance_status'),
    mot: formData.get('mot'),
    tracker: formData.get('tracker') === 'on',
    tracker_observation: formData.get('tracker_observation'),
    observations: formData.get('observations'),
    company_id: formData.get('company_id'),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Vehicle.',
    };
  }

  // Prepare data for insertion into the database
  const {
    plate,
    make,
    model,
    series,
    type,
    year_of_manufacture,
    year_registration,
    engine_capacity,
    power,
    mileage,
    transmission,
    fuel_type,
    color,
    vin,
    engine_number,
    status,
    sale_price,
    rental_price,
    document_status,
    insurance_status,
    maintenance_status,
    mot,
    tracker,
    tracker_observation,
    observations,
    company_id,
  } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO vehicles (
        plate, make, model, series, type, year_of_manufacture, year_registration, engine_capacity, power, mileage, transmission, fuel_type, color, vin, engine_number, status, sale_price, rental_price, document_status, insurance_status, maintenance_status, mot, tracker, tracker_observation, observations, company_id
      ) VALUES (
        ${toUpperCase(plate)}, ${make}, ${model}, ${series}, ${type}, ${year_of_manufacture}, ${year_registration}, ${engine_capacity}, ${power}, ${mileage}, ${transmission}, ${fuel_type}, ${color}, ${vin}, ${engine_number}, ${status}, ${sale_price}, ${rental_price}, ${document_status}, ${insurance_status}, ${maintenance_status}, ${mot}, ${tracker}, ${tracker_observation}, ${observations}, ${company_id}
      )
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    console.log("Deu erro", error)
    return {
      message: 'Database Error: Failed to Create Vehicle.',
    };
  }

  // Revalidate the cache for the vehicles page and redirect the user.
  revalidatePath('/dashboard/motos');
  redirect('/dashboard/motos');
}

export async function updateVehicle(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateVehicle.safeParse({
    plate: formData.get('plate'),
    make: formData.get('make'),
    model: formData.get('model'),
    series: formData.get('series'),
    type: formData.get('type'),
    year_of_manufacture: formData.get('year_of_manufacture') ? Number(formData.get('year_of_manufacture')) : undefined,
    year_registration: formData.get('year_registration'),
    engine_capacity: formData.get('engine_capacity'),
    power: formData.get('power'),
    mileage: formData.get('mileage') ? Number(formData.get('mileage')) : undefined,
    transmission: formData.get('transmission'),
    fuel_type: formData.get('fuel_type'),
    color: formData.get('color'),
    vin: formData.get('vin'),
    engine_number: formData.get('engine_number'),
    status: formData.get('status'),
    sale_price: formData.get('sale_price'),
    rental_price: formData.get('rental_price'),
    document_status: formData.get('document_status'),
    insurance_status: formData.get('insurance_status'),
    maintenance_status: formData.get('maintenance_status'),
    mot: formData.get('mot'),
    tracker: formData.get('tracker') === 'on',
    tracker_observation: formData.get('tracker_observation'),
    observations: formData.get('observations'),
    company_id: formData.get('company_id'),
  });

  if (!validatedFields.success) {
    console.log("Erro dodio", validatedFields.error.flatten().fieldErrors,)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Vehicle.',
    };
  }

  const {
    plate,
    make,
    model,
    series,
    type,
    year_of_manufacture,
    year_registration,
    engine_capacity,
    power,
    mileage,
    transmission,
    fuel_type,
    color,
    vin,
    engine_number,
    status,
    sale_price,
    rental_price,
    document_status,
    insurance_status,
    maintenance_status,
    mot,
    tracker,
    tracker_observation,
    observations,
    company_id,
  } = validatedFields.data;

  try {
    await sql`
      UPDATE vehicles
      SET
        plate = ${toUpperCase(plate)},
        make = ${make},
        model = ${model},
        series = ${series},
        type = ${type},
        year_of_manufacture = ${year_of_manufacture},
        year_registration = ${year_registration},
        engine_capacity = ${engine_capacity},
        power = ${power},
        mileage = ${mileage},
        transmission = ${transmission},
        fuel_type = ${fuel_type},
        color = ${color},
        vin = ${vin},
        engine_number = ${engine_number},
        status = ${status},
        sale_price = ${sale_price},
        rental_price = ${rental_price},
        document_status = ${document_status},
        insurance_status = ${insurance_status},
        maintenance_status = ${maintenance_status},
        mot = ${mot},
        tracker = ${tracker},
        tracker_observation = ${tracker_observation},
        observations = ${observations},
        company_id = ${company_id}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Vehicle.' };
  }

  revalidatePath('/dashboard/motos');
  redirect('/dashboard/motos');
}

export async function deleteVehicle(id: string) {
  // Delete the vehicle from the database
  try {
    await sql`DELETE FROM vehicles WHERE id = ${id}`;
    revalidatePath('/dashboard/motos');
    return { message: 'Deleted Vehicle' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Vehicle.' };
  }
}
