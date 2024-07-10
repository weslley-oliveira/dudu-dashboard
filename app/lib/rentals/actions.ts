'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const RentalSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  startDate: z.string().min(1, { message: 'Start date is required.' }),
  endDate: z.string().min(1, { message: 'End date is required.' }),
  total: z.number().positive(),
  daypayment: z.string().optional(),
  createdAt: z.string(),
});

const CreateRental = RentalSchema.omit({ id: true, createdAt: true });
const UpdateRental = RentalSchema.omit({ createdAt: true });

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

  // Insert data into the database
  try {
    await sql`
      INSERT INTO rentals (
        customer_id, vehicle_id, start_date, end_date, total, daypayment, created_at
      )
      VALUES (
        ${customerId}, ${vehicleId}, ${startDate}, ${endDate}, ${total}, ${daypayment}, ${createdAt}
      )
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Rental.',
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
    
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Rental.',
    };
  }

  const {
    customerId, vehicleId, startDate, endDate, total, daypayment
  } = validatedFields.data;
  const updatedAt = new Date().toISOString();

  try {
    await sql`
      UPDATE rentals
      SET 
        customer_id = ${customerId}, vehicle_id = ${vehicleId}, start_date = ${startDate}, 
        end_date = ${endDate}, total = ${total}, daypayment = ${daypayment}, updated_at = ${updatedAt}
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
  try {
    await sql`DELETE FROM rentals WHERE id = ${id}`;
    revalidatePath('/dashboard/rentals');
    return { message: 'Deleted Rental' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Delete Rental.' };
  }
}