'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const ItemRequestSchema = z.object({
  id: z.string(),
  mechanic_id: z.string().min(1, { message: 'Mechanic ID is required.' }),
  item_id: z.string().min(1, { message: 'Item ID is required.' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1.' }),
  status: z.string().optional().default('Pending'),
  created_at: z.string(),
  updated_at: z.string(),
});

const CreateItemRequest = ItemRequestSchema.omit({ id: true, created_at: true, updated_at: true });
const UpdateItemRequest = ItemRequestSchema.omit({ id: true, created_at: true, updated_at: true });

// This is temporary
export type State = {
  errors?: {
    mechanic_id?: string[];
    item_id?: string[];
    item_name?: string[];
    quantity?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createItemRequest(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateItemRequest.safeParse({
    mechanic_id: formData.get('mechanic_id'),
    item_id: formData.get('item_id'),
    quantity: formData.get('quantity'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Item Request.',
    };
  }

  // Prepare data for insertion into the database
  const { mechanic_id, item_id, quantity, status } = validatedFields.data;
  const created_at = new Date().toISOString();
  const updated_at = created_at;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO item_requests (
        mechanic_id, item_id, quantity, status, created_at, updated_at
      )
      VALUES (
        ${mechanic_id}, ${item_id}, ${quantity}, ${status}, ${created_at}, ${updated_at}
      )
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Item Request.',
    };
  }

  // Revalidate the cache for the item requests page and redirect the user.
  revalidatePath('/dashboard/item-requests');
  redirect('/dashboard/item-requests');
}

export async function updateItemRequest(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateItemRequest.safeParse({
    mechanic_id: formData.get('mechanic_id'),
    item_id: formData.get('item_id'),
    quantity: formData.get('quantity'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Item Request.',
    };
  }

  const { mechanic_id, item_id, quantity, status } = validatedFields.data;
  const updated_at = new Date().toISOString();

  try {
    await sql`
      UPDATE item_requests
      SET 
        mechanic_id = ${mechanic_id}, item_id = ${item_id}, quantity = ${quantity}, 
        status = ${status}, updated_at = ${updated_at}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Item Request.' };
  }

  revalidatePath('/dashboard/item-requests');
  redirect('/dashboard/item-requests');
}

export async function deleteItemRequest(id: string) {
  try {
    await sql`DELETE FROM item_requests WHERE id = ${id}`;
    revalidatePath('/dashboard/item-requests');
    return { message: 'Deleted Item Request' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Item Request.' };
  }
}