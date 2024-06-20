'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { toUpperCase } from '../utils';

const CreateProduct = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  price: z.number().positive({ message: 'Price must be a positive number' }),
  description: z.string().optional(),
  status: z.string().min(1, { message: 'Status is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
});

export async function createProduct(prevState: any, formData: FormData) {
  const validatedFields = CreateProduct.safeParse({
    name: formData.get('name'),
    price: Number(formData.get('price')),
    description: formData.get('description'),
    status: formData.get('status'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product.',
    };
  }

  const { name, price, description, status, category } = validatedFields.data;

  try {
    await sql`
      INSERT INTO products (name, price, description, status, category)
      VALUES (${toUpperCase(name)}, ${price}, ${description}, ${status}, ${category})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Product.',
    };
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

const UpdateProduct = z.object({
  price: z.number().positive({ message: 'Price must be a positive number' }),
  description: z.string().optional(),
  status: z.string().min(1, { message: 'Status is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
});

export async function updateProduct(id: string, prevState: any, formData: FormData) {
  const validatedFields = UpdateProduct.safeParse({
    price: Number(formData.get('price')),
    description: formData.get('description'),
    status: formData.get('status'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Product.',
    };
  }

  const { price, description, status, category } = validatedFields.data;

  try {
    await sql`
      UPDATE products
      SET price = ${price}, description = ${description}, status = ${status}, category = ${category}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Update Product.',
    };
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function deleteProduct(id: string) {
  try {
    await sql`DELETE FROM products WHERE id = ${id}`;
    revalidatePath('/dashboard/products');
    return { message: 'Deleted Product' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Product.' };
  }
}