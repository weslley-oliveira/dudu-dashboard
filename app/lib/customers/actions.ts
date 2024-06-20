'use server';

import { sql } from '@vercel/postgres';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Customer } from '../definitions';

const CustomerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  status: z.string().min(1, { message: 'Status is required' }),
  description: z.string().optional(),
});

export async function createCustomer(formData: FormData) {
  const customerData = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    status: formData.get('status')?.toString() || '',
    description: formData.get('description')?.toString() || '',
  };

  const validatedFields = CustomerSchema.safeParse(customerData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create customer',
    };
  }

  const { name, email, status, description } = validatedFields.data;

  try {
    await sql`
      INSERT INTO customers (name, email, status, description)
      VALUES (${name}, ${email}, ${status}, ${description})
    `;
    revalidatePath('/dashboard/customers');
    return { message: 'Customer created successfully' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Failed to create customer due to a database error' };
  }
}

export async function updateCustomer(id: string, formData: FormData) {
  const customerData = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    status: formData.get('status')?.toString() || '',
    description: formData.get('description')?.toString() || '',
  };

  const validatedFields = CustomerSchema.safeParse(customerData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update customer',
    };
  }

  const { name, email, status, description } = validatedFields.data;

  try {
    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}, status = ${status}, description = ${description}
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/customers');
    return { message: 'Customer updated successfully' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Failed to update customer due to a database error' };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
    return { message: 'Deleted Customer' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Failed to delete customer' };
  }
}