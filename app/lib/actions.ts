'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import { error } from 'console';
import { toUpperCase } from './utils';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ date: true, id: true });

const CreateVehicle = z.object({
  plate: z.string().min(1, { message: 'Plate is required' }),
  make: z.string().min(1, { message: 'Make is required' }),
  type: z.string().min(1, { message: 'Type is required' }),
  series: z.string().min(1, { message: 'Series is required' }),
  mileage: z.number().nonnegative({ message: 'Mileage must be a non-negative number' }),
  observations: z.string().optional(),
  model: z.string().min(1, { message: 'Model is required' }),
  engine_capacity: z.string().min(1, { message: 'Engine Capacity is required' }),
  vin: z.string().min(1, { message: 'VIN is required' }),
  engine_number: z.string().min(1, { message: 'Engine Number is required' }),
  fuel_type: z.string().min(1, { message: 'Fuel Type is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  company_id: z.string().optional(),
  year_of_manufacture: z.number().int().nonnegative({ message: 'Year of Manufacture must be a non-negative integer' }),
  mot: z.string().optional(),
  tracker: z.boolean().optional(),
  tracker_observation: z.string().optional(),
  color: z.string().min(1, { message: 'Color is required' })
});
// This is temporary
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function createVehicle(prevState: State, formData: FormData) {
  // Validar os campos do formulário usando Zod
  const validatedFields = CreateVehicle.safeParse({
    plate: formData.get('plate'),
    make: formData.get('make'),
    type: formData.get('type'),
    series: formData.get('series'),
    mileage: Number(formData.get('mileage')),
    observations: formData.get('observations'),
    model: formData.get('model'),
    engine_capacity: formData.get('engine_capacity'),
    vin: formData.get('vin'),
    engine_number: formData.get('engine_number'),
    fuel_type: formData.get('fuel_type'),
    status: formData.get('status'),
    company_id: formData.get('company_id'),
    year_of_manufacture: Number(formData.get('year_of_manufacture')),
    mot: formData.get('mot'),
    tracker: formData.get('tracker') === 'on',
    tracker_observation: formData.get('tracker_observation'),
    color: formData.get('color')
  });

  // Se a validação do formulário falhar, retornar erros imediatamente.
  if (!validatedFields.success) {
    console.log('teste', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Vehicle.',
    };
  }

  // Preparar os dados para inserção no banco de dados
  const {
    plate,
    make,
    type,
    series,
    mileage,
    observations,
    model,
    engine_capacity,
    vin,
    engine_number,
    fuel_type,
    status,
    company_id,
    year_of_manufacture,
    mot,
    tracker,
    tracker_observation,
    color
  } = validatedFields.data;

  // Inserir os dados no banco de dados
  try {
    await sql`
      INSERT INTO vehicles (
        plate, make, type, series, mileage, observations, model, engine_capacity, vin, engine_number, fuel_type, status, company_id, year_of_manufacture, mot, tracker, tracker_observation, color
      ) VALUES (
        ${toUpperCase(plate)}, ${make}, ${type}, ${series}, ${mileage}, ${observations}, ${model}, ${engine_capacity}, ${vin}, ${engine_number}, ${fuel_type}, ${status}, ${company_id}, ${year_of_manufacture}, ${mot}, ${tracker}, ${tracker_observation}, ${color}
      )
    `;
  } catch (error) {
    // Se ocorrer um erro no banco de dados, retornar um erro mais específico.
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Vehicle.',
    };
  }

  // Revalidar o cache para a página de veículos e redirecionar o usuário.
  revalidatePath('/dashboard/motos');
  redirect('/dashboard/motos');
}


const UpdateVehicle = z.object({
  mileage: z.number().nonnegative({ message: 'Mileage must be a non-negative number' }),
  observations: z.string().optional(),
  status: z.string().min(1, { message: 'Status is required' }),
  company_id: z.string().nullable(),
  tracker: z.boolean(),
  tracker_observation: z.string().optional(),
});

export async function updateVehicle(prevState: any, formData: FormData) {
  const plate = formData.get('plate')?.toString();
  if (!plate) {
    return {
      errors: { plate: ['Plate is required'] },
      message: 'Failed to update vehicle.',
    };
  }

  const validatedFields = UpdateVehicle.safeParse({
    mileage: Number(formData.get('mileage')),
    observations: formData.get('observations'),
    status: formData.get('status'),
    company_id: formData.get('company_id'),
    tracker: formData.get('tracker') === 'on',
    tracker_observation: formData.get('tracker_observation'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update vehicle.',
    };
  }

  const {
    mileage,
    observations,
    status,
    company_id,
    tracker,
    tracker_observation,
  } = validatedFields.data;

  try {
    await sql`
      UPDATE vehicles
      SET
        mileage = ${mileage},
        observations = ${observations},
        status = ${status},
        company_id = ${company_id},
        tracker = ${tracker},
        tracker_observation = ${tracker_observation}
      WHERE
        plate = ${plate}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to update vehicle.',
    };
  }

  return {
    message: 'Vehicle updated successfully.',
  };
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
});

const CreateUser = UserSchema;
const UpdateUser = UserSchema.omit({ password: true});

// This is temporary
export type State1 = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function createUser(prevState: State1, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User.',
    };
  }

  // Prepare data for insertion into the database
  const { name, email, password } = validatedFields.data;
  const hashedPassword = await hashPassword(password); // Assuming you have a function to hash the password

  // Insert data into the database
  try {
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create User.',
    };
  }

  // Revalidate the cache for the users page and redirect the user.
  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

export async function updateUser(
  id: string,
  prevState: State1,
  formData: FormData,
) {
  const validatedFields = UpdateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update User.',
    };
  }

  const { name, email} = validatedFields.data;


  try {
    await sql`
    UPDATE users
      SET name = ${name}, email = ${email}
    WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update User.' };
  }

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

// Example function to hash passwords (using bcrypt for example)


async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice');

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}
export async function deleteVehicle(id: string) {
  // throw new Error('Failed to Delete Invoice');
  console.log('atatas dashdsa', id)
  try {
    await sql`DELETE FROM vehicles WHERE VRN = ${id}`;
    revalidatePath('/dashboard/motos');
    return { message: 'Deleted Vehicles' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}
export async function deleteUser(id: string) {
  // throw new Error('Failed to Delete Invoice');

  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    revalidatePath('/dashboard/users');
    return { message: 'Deleted User' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
