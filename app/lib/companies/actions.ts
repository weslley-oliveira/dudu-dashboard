'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const CompanySchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required.' }),
  registration_number: z.string().min(1, { message: 'Registration number is required.' }),
  vat_number: z.string().optional(),
  address_street: z.string().optional(),
  address_number: z.string().optional(),
  address_complement: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  address_postcode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address.' }).optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

const CreateCompany = CompanySchema.omit({ id: true, created_at: true, updated_at: true });
const UpdateCompany = CompanySchema.omit({ id:true, created_at: true, updated_at: true });

// This is temporary
export type State = {
  errors?: {
    name?: string[];
    registration_number?: string[];
    email?: string[];
  };
  message?: string | null;
};

export async function createCompany(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateCompany.safeParse({
    name: formData.get('name'),
    registration_number: formData.get('registration_number'),
    vat_number: formData.get('vat_number'),
    address_street: formData.get('address_street'),
    address_number: formData.get('address_number'),
    address_complement: formData.get('address_complement'),
    address_city: formData.get('address_city'),
    address_state: formData.get('address_state'),
    address_postcode: formData.get('address_postcode'),
    phone: formData.get('phone'),
    email: formData.get('email'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Company.',
    };
  }

  // Prepare data for insertion into the database
  const {
    name, registration_number, vat_number, address_street, address_number, address_complement, 
    address_city, address_state, address_postcode, phone, email
  } = validatedFields.data;
  const created_at = new Date().toISOString();
  const updated_at = created_at;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO companies (
        name, registration_number, vat_number, address_street, address_number, address_complement,
        address_city, address_state, address_postcode, phone, email, created_at, updated_at
      )
      VALUES (
        ${name}, ${registration_number}, ${vat_number}, ${address_street}, ${address_number}, ${address_complement},
        ${address_city}, ${address_state}, ${address_postcode}, ${phone}, ${email}, ${created_at}, ${updated_at}
      )
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Company.',
    };
  }

  // Revalidate the cache for the companies page and redirect the user.
  revalidatePath('/dashboard/companies');
  redirect('/dashboard/companies');
}

export async function updateCompany(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateCompany.safeParse({
    name: formData.get('name'),
    registration_number: formData.get('registration_number'),
    vat_number: formData.get('vat_number'),
    address_street: formData.get('address_street'),
    address_number: formData.get('address_number'),
    address_complement: formData.get('address_complement'),
    address_city: formData.get('address_city'),
    address_state: formData.get('address_state'),
    address_postcode: formData.get('address_postcode'),
    phone: formData.get('phone'),
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    console.log("Parangole",validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Company.',
    };
  }

  const {
    name, registration_number, vat_number, address_street, address_number, address_complement,
    address_city, address_state, address_postcode, phone, email
  } = validatedFields.data;
  const updated_at = new Date().toISOString();

  try {
    await sql`
      UPDATE companies
      SET 
        name = ${name}, registration_number = ${registration_number}, vat_number = ${vat_number}, 
        address_street = ${address_street}, address_number = ${address_number}, address_complement = ${address_complement},
        address_city = ${address_city}, address_state = ${address_state}, address_postcode = ${address_postcode}, 
        phone = ${phone}, email = ${email}, updated_at = ${updated_at}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Company.' };
  }

  revalidatePath('/dashboard/companies');
  redirect('/dashboard/companies');
}

export async function deleteCompany(id: string) {
  // throw new Error('Failed to Delete Company');

  try {
    await sql`DELETE FROM companies WHERE id = ${id}`;
    revalidatePath('/dashboard/companies');
    return { message: 'Deleted Company' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Company.' };
  }
}