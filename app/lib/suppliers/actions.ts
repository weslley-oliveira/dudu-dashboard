'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const SupplierSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required.' }),
  contact_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address.' }).optional(),
  address: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

const CreateSupplier = SupplierSchema.omit({ id: true, created_at: true, updated_at: true });
const UpdateSupplier = SupplierSchema.omit({ id: true, created_at: true, updated_at: true });

// This is temporary
export type State = {
  errors?: {
    name?: string[];
    email?: string[];
  };
  message?: string | null;
};

export async function createSupplier(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateSupplier.safeParse({
    name: formData.get('name'),
    contact_name: formData.get('contact_name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    address: formData.get('address'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Supplier.',
    };
  }

  // Prepare data for insertion into the database
  const {
    name, contact_name, phone, email, address
  } = validatedFields.data;
  const created_at = new Date().toISOString();
  const updated_at = created_at;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO suppliers (
        name, contact_name, phone, email, address, created_at, updated_at
      )
      VALUES (
        ${name}, ${contact_name}, ${phone}, ${email}, ${address}, ${created_at}, ${updated_at}
      )
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Supplier.',
    };
  }

  // Revalidate the cache for the suppliers page and redirect the user.
  revalidatePath('/dashboard/suppliers');
  redirect('/dashboard/suppliers');
}

export async function updateSupplier(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateSupplier.safeParse({
    name: formData.get('name'),
    contact_name: formData.get('contact_name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    address: formData.get('address'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Supplier.',
    };
  }

  const {
    name, contact_name, phone, email, address
  } = validatedFields.data;
  const updated_at = new Date().toISOString();

  try {
    await sql`
      UPDATE suppliers
      SET 
        name = ${name}, contact_name = ${contact_name}, phone = ${phone}, 
        email = ${email}, address = ${address}, updated_at = ${updated_at}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Supplier.' };
  }

  revalidatePath('/dashboard/suppliers');
  redirect('/dashboard/suppliers');
}

export async function deleteSupplier(id: string) {
  try {
    await sql`DELETE FROM suppliers WHERE id = ${id}`;
    revalidatePath('/dashboard/suppliers');
    return { message: 'Deleted Supplier' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Supplier.' };
  }
}