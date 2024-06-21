'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Schema de validação usando Zod
const CustomerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(1, { message: 'Phone is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  vehicle_plate: z.string().min(1, { message: 'Vehicle plate is required' }),
  descriptions: z.string().optional(),
  date_of_birth: z.string().min(1, { message: 'Date of birth is required' }),
});

const CreateCustomerSchema = CustomerSchema.omit({ id: true });
const UpdateCustomerSchema = CustomerSchema.omit({ id: true });

// Tipos para o estado do formulário
export type State = {
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    address?: string[];
    status?: string[];
    vehicle_plate?: string[];
    descriptions?: string[];
    date_of_birth?: string[];
  };
  message?: string | null;
};

// Função para criar um cliente
export async function createCustomer(prevState: State, formData: FormData) {
  const customerData = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    phone: formData.get('phone')?.toString() || '',
    address: formData.get('address')?.toString() || '',
    status: formData.get('status')?.toString() || '',
    vehicle_plate: formData.get('vehicle_plate')?.toString() || '',
    descriptions: formData.get('description')?.toString() || '',
    date_of_birth: formData.get('date_of_birth')?.toString() || '',
  };

  const validatedFields = CreateCustomerSchema.safeParse(customerData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create customer',
    };
  }

  const { name, email, phone, address, status, vehicle_plate, descriptions, date_of_birth } = validatedFields.data;

  try {
    await sql`
      INSERT INTO customers (name, email, phone, address, status, vehicle_plate, descriptions, date_of_birth)
      VALUES (${name}, ${email}, ${phone}, ${address}, ${status}, ${vehicle_plate}, ${descriptions}, ${date_of_birth})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Failed to create customer due to a database error' };
  }
  revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

// Função para atualizar um cliente
export async function updateCustomer(id: string, prevState: State, formData: FormData) {
  const customerData = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    phone: formData.get('phone')?.toString() || '',
    address: formData.get('address')?.toString() || '',
    status: formData.get('status')?.toString() || '',
    vehicle_plate: formData.get('vehicle_plate')?.toString() || '',
    description: formData.get('description')?.toString() || '',
    date_of_birth: formData.get('date_of_birth')?.toString() || '',
  };

  const validatedFields = UpdateCustomerSchema.safeParse(customerData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update customer',
    };
  }

  const { name, email, phone, address, status, vehicle_plate, descriptions, date_of_birth } = validatedFields.data;

  try {
    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}, phone = ${phone}, address = ${address}, status = ${status}, vehicle_plate = ${vehicle_plate}, description = ${descriptions}, date_of_birth = ${date_of_birth}
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/invoices');
    return { message: 'Customer updated successfully' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Failed to update customer due to a database error' };
  }
}

// Função para deletar um cliente
export async function deleteCustomer(id: string) {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath('/dashboard/customers');
    return { message: 'Deleted Customer' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Failed to delete customer' };
  }
}
