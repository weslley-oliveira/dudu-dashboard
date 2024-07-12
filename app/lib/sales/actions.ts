'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Define the schema for Sales
const SaleSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  vehicleId: z.string().uuid().optional(),
  total: z.number().positive(),
  unitOfMeasurement: z.string().min(1, { message: 'Unit of measurement is required.' }),
  status: z.string().min(1, { message: 'Status is required.' }), // Novo campo de status
  saleCode: z.string(), // Novo campo de saleCode
  createdAt: z.string(),
});

const CreateSale = SaleSchema.omit({ id: true, createdAt: true });
const UpdateSale = SaleSchema.omit({ createdAt: true });

// This is temporary
export type State = {
  errors?: {
    total?: string[];
    unitOfMeasurement?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Function to generate new sale code
async function generateSaleCode(): Promise<string> {
  const latestSale = await sql<{ sale_code: string }>`
    SELECT sale_code
    FROM sales
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const latestCode = latestSale.rows[0]?.sale_code || 'inv-[000]';
  const latestNumber = parseInt(latestCode.replace('inv-[', '').replace(']', ''), 10);
  const newNumber = latestNumber + 1;
  return `inv-[${newNumber.toString().padStart(3, '0')}]`;
}

export async function createSale(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateSale.safeParse({
    customerId: formData.get('customerId'),
    vehicleId: formData.get('vehicleId') || null,
    total: parseFloat(formData.get('total') as string),
    unitOfMeasurement: formData.get('unitOfMeasurement'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log("debug", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Sale.',
    };
  }

  // Generate new sale code
  const saleCode = await generateSaleCode();

  // Prepare data for insertion into the database
  const {
    customerId, vehicleId, total, unitOfMeasurement, status
  } = validatedFields.data;
  const createdAt = new Date().toISOString();

  // Insert data into the database
  try {
    await sql`
      INSERT INTO sales (
        customer_id, vehicle_id, total, unit_of_measurement, status, sale_code, created_at
      )
      VALUES (
        ${customerId}, ${vehicleId}, ${total}, ${unitOfMeasurement}, ${status}, ${saleCode}, ${createdAt}
      )
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Sale.',
    };
  }

  // Revalidate the cache for the sales page and redirect the user.
  revalidatePath('/dashboard/sales');
  redirect('/dashboard/sales');
}

export async function updateSale(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateSale.safeParse({
    customerId: formData.get('customerId'),
    vehicleId: formData.get('vehicleId') || null,
    total: parseFloat(formData.get('total') as string),
    unitOfMeasurement: formData.get('unitOfMeasurement'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Sale.',
    };
  }

  const {
    customerId, vehicleId, total, unitOfMeasurement, status
  } = validatedFields.data;
  const updatedAt = new Date().toISOString();

  try {
    await sql`
      UPDATE sales
      SET 
        customer_id = ${customerId}, vehicle_id = ${vehicleId}, total = ${total}, 
        unit_of_measurement = ${unitOfMeasurement}, status = ${status}, updated_at = ${updatedAt}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Sale.' };
  }

  revalidatePath('/dashboard/sales');
  redirect('/dashboard/sales');
}

export async function deleteSale(id: string) {
  try {
    await sql`DELETE FROM sales WHERE id = ${id}`;
    revalidatePath('/dashboard/sales');
    return { message: 'Deleted Sale' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Delete Sale.' };
  }
}
