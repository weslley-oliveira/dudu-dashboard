'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Category } from '@/app/lib/categories/definitions';

const FormSchema = z.object({
  id: z.string().uuid().optional(),
  category_name: z.string().min(1, { message: 'Category name is required.' }),
  description: z.string().optional(),
});

const CreateCategory = FormSchema.omit({ id: true });
const UpdateCategory = FormSchema.partial();

// This is temporary
export type State = {
  errors?: {
    category_name?: string[];
    description?: string[];
  };
  message?: string | null;
};

export async function createCategory(prevState: State, formData: FormData) {

  console.log("teste kkkkkkkk", formData)
  // Validate form fields using Zod
  const validatedFields = CreateCategory.safeParse({
    category_name: formData.get('category_name'),
    description: formData.get('description'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Category.',
    };
  }

  // Prepare data for insertion into the database
  const { category_name, description } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO categories (category_name, description)
      VALUES (${category_name}, ${description})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Category.',
    };
  }

  // Revalidate the cache for the categories page and redirect the user.
  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}

export async function updateCategory(id: string, prevState: State, formData: FormData) {

  
  // Validate form fields using Zod
  const validatedFields = UpdateCategory.safeParse({
    category_name: formData.get('category_name'),
    description: formData.get('description'),
  });

  
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log("teste kkkkkkkk", id)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Category.',
    };
  }

  // Prepare data for updating in the database
  const { category_name, description } = validatedFields.data;

  // Update data in the database
  try {
    await sql`
      UPDATE categories
      SET category_name = ${category_name}, description = ${description}
      WHERE id = ${id}
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Update Category.',
    };
  }

  // Revalidate the cache for the categories page and redirect the user.
  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}

export async function deleteCategory(id: string) {
  // Delete the category from the database
  try {
    await sql`DELETE FROM categories WHERE id = ${id}`;
    revalidatePath('/dashboard/categories');
    return { message: 'Deleted Category' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Category.' };
  }
}