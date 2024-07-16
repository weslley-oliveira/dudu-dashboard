'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { fetchRentalById } from './data';

const RentalSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  startDate: z.string().min(1, { message: 'Start date is required.' }),
  endDate: z.string().optional(),
  total: z.number().positive(),
  daypayment: z.string().optional(),
  createdAt: z.string(),
});

const CreateRental = RentalSchema.omit({ id: true, createdAt: true });
const UpdateRental = RentalSchema.omit({ id: true, createdAt: true });

// This is temporary
export type State = {
  errors?: {
    startDate?: string[];
    endDate?: string[];
    total?: string[];
  };
  message?: string | null;
};

export async function createRental(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateRental.safeParse({
    customerId: formData.get('customerId'),
    vehicleId: formData.get('vehicleId'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    total: parseFloat(formData.get('total') as string),
    daypayment: formData.get('daypayment'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log("debug", validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Rental.',
    };
  }

  // Prepare data for insertion into the database
  const {
    customerId, vehicleId, startDate, endDate, total, daypayment
  } = validatedFields.data;
  const createdAt = new Date().toISOString();

  // Convert startDate and endDate to timestamps
  const startDateTimestamp = new Date(startDate).toISOString();
  const endDateTimestamp = endDate ? new Date(endDate).toISOString() : null;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO rentals (
        customer_id, vehicle_id, start_date, end_date, total, daypayment, created_at
      )
      VALUES (
        ${customerId}, ${vehicleId}, ${startDateTimestamp}, ${endDateTimestamp}, ${total}, ${daypayment}, ${createdAt}
      )
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Rental.',
    };
  }

  try {
    await sql`
      UPDATE vehicles
      SET status = 'rented'
      WHERE id = ${vehicleId};
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    console.error('ID DO VEICULO:', vehicleId);
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Update Vehicle.',
    };
  }

  // Revalidate the cache for the rentals page and redirect the user.
  revalidatePath('/dashboard/rentals');
  redirect('/dashboard/rentals');
}

export async function updateRental(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateRental.safeParse({
    customerId: formData.get('customerId'),
    vehicleId: formData.get('vehicleId'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    total: parseFloat(formData.get('total') as string),
    daypayment: formData.get('daypayment'),
  });

  if (!validatedFields.success) {

    console.log('teste   dsdws', validatedFields.error.flatten().fieldErrors,)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Rental.',
    };
  }

  const {
    customerId, vehicleId, startDate, endDate, total, daypayment
  } = validatedFields.data;

  // Convert startDate and endDate to timestamps
  const startDateTimestamp = new Date(startDate).toISOString();
  const endDateTimestamp = endDate ? new Date(endDate).toISOString() : null;

  try {
    await sql`
      UPDATE rentals
      SET 
        customer_id = ${customerId}, vehicle_id = ${vehicleId}, start_date = ${startDateTimestamp}, 
        end_date = ${endDateTimestamp}, total = ${total}, daypayment = ${daypayment}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Rental.' };
  }

  revalidatePath('/dashboard/rentals');
  redirect('/dashboard/rentals');
}

export async function deleteRental(id: string) {
  // Fetch the rental by id to get the vehicle_id
  const rental = await fetchRentalById(id);

  if (!rental || !rental.vehicleId) {
    console.error('Rental not found or vehicle_id is missing');
    return { message: 'Rental not found or vehicle_id is missing' };
  }

  const { vehicleId } = rental;
  console.log(vehicleId);

  try {
    // Delete the rental
    await sql`DELETE FROM rentals WHERE id = ${id}`;
    
    // Update the vehicle status to 'available'
    await sql`
      UPDATE vehicles
      SET status = 'available'
      WHERE id = ${vehicleId};
    `;
    
    // Revalidate the cache and return a success message
    revalidatePath('/dashboard/rentals');
    return { message: 'Deleted Rental' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Delete Rental.' };
  }
}
