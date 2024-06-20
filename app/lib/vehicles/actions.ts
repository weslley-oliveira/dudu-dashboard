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
  type: z.string().min(1, { message: 'Type is required' }),
  series: z.string().min(1, { message: 'Series is required' }),
  mileage: z.number().nonnegative({ message: 'Mileage must be a non-negative number' }).optional(),
  observations: z.string().optional(),
  model: z.string().min(1, { message: 'Model is required' }),
  engine_capacity: z.string().min(1, { message: 'Engine Capacity is required' }),
  vin: z.string().min(1, { message: 'VIN is required' }),
  engine_number: z.string().min(1, { message: 'Engine Number is required' }),
  fuel_type: z.string().min(1, { message: 'Fuel Type is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  company_id: z.string().optional(),
  year_of_manufacture: z.number().int().nonnegative().optional(),
  mot: z.string().optional(),
  tracker: z.boolean().optional(),
  tracker_observation: z.union([z.string(), z.null()]).optional(), // Permite string ou null
  color: z.string().min(1, { message: 'Color is required' }),
});
const CreateVehicle = FormSchema.partial().omit({ id: true });
const UpdateVehicle = FormSchema.partial().omit({ tracker_observation: true });;

// This is temporary
export type State = {
  errors?: {
    plate?: string[];
    make?: string[];
    type?: string[];
    series?: string[];
    mileage?: string[];
    observations?: string[];
    model?: string[];
    engine_capacity?: string[];
    vin?: string[];
    engine_number?: string[];
    fuel_type?: string[];
    status?: string[];
    company_id?: string[];
    year_of_manufacture?: string[];
    mot?: string[];
    tracker?: string[];
    tracker_observation?: string[];
    color?: string[];
  };
  message?: string | null;
};

export async function createVehicle(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateVehicle.safeParse({
    plate: formData.get('plate'),
    make: formData.get('make'),
    type: formData.get('type'),
    series: formData.get('series'),
    mileage: Number(formData.get('mileage')),
    observations: formData.get('observations'),
    model: formData.get('model'),
    engine_capacity: formData.get('engine_capacity'),
    vin: formData.get('vin'),
    engine_number: formData.get('engine_number'),
    fuel_type: formData.get('fuel_type'),
    status: formData.get('status'),
    company_id: formData.get('company_id'),
    year_of_manufacture: Number(formData.get('year_of_manufacture')),
    mot: formData.get('mot'),
    tracker: formData.get('tracker') === 'on',
    tracker_observation: formData.get('tracker_observation'),
    color: formData.get('color'),
  });

  
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log("teste2",validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Vehicle.',
    };
  }

  // Prepare data for insertion into the database
  const {
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
  } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO vehicles (
        plate, make, type, series, mileage, observations, model, engine_capacity, vin, engine_number, fuel_type, status, company_id, year_of_manufacture, mot, tracker, tracker_observation, color
      ) VALUES (
        ${toUpperCase(plate)}, ${make}, ${type}, ${series}, ${mileage}, ${observations}, ${model}, ${engine_capacity}, ${vin}, ${engine_number}, ${fuel_type}, ${status}, ${company_id}, ${year_of_manufacture}, ${mot}, ${tracker}, ${tracker_observation}, ${color}
      )
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
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
    type: formData.get('type'),
    series: formData.get('series'),
    mileage: formData.get('mileage') ? Number(formData.get('mileage')) : undefined,
    observations: formData.get('observations'),
    model: formData.get('model'),
    engine_capacity: formData.get('engine_capacity'),
    vin: formData.get('vin'),
    engine_number: formData.get('engine_number'),
    fuel_type: formData.get('fuel_type'),
    status: formData.get('status'),
    company_id: formData.get('company_id'),
    year_of_manufacture: formData.get('year_of_manufacture') ? Number(formData.get('year_of_manufacture')) : undefined,
    mot: formData.get('mot'),
    tracker: formData.get('tracker') === 'on',
    tracker_observation: formData.get('tracker_observation'),
    color: formData.get('color'),
  });

  

  if (!validatedFields.success) {
    console.log("tetestete,",validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Vehicle.',
    };
  }

  const {
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
    color,
  } = validatedFields.data;

  try {
    await sql`
      UPDATE vehicles
      SET
        plate = ${plate},
        make = ${make},
        type = ${type},
        series = ${series},
        mileage = ${mileage},
        observations = ${observations},
        model = ${model},
        engine_capacity = ${engine_capacity},
        vin = ${vin},
        engine_number = ${engine_number},
        fuel_type = ${fuel_type},
        status = ${status},
        company_id = ${company_id},
        year_of_manufacture = ${year_of_manufacture},
        mot = ${mot},
        tracker = ${tracker},
        color = ${color}
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