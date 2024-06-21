'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';

const UserSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  full_name: z.string().min(1, { message: 'Full name is required.' }),
  user_type: z.enum(['customer', 'mechanic', 'attendant'], { message: 'User type is required.' }),
  avatar_url: z.string().url({ message: 'Invalid URL.' }).optional(),
  phone: z.string().min(1, { message: 'Phone is required.' }),
});

const CreateUser = UserSchema;
const UpdateUser = UserSchema.omit({ password: true });

// This is temporary
export type State = {
  errors?: {
    username?: string[];
    password?: string[];
    email?: string[];
    full_name?: string[];
    user_type?: string[];
    avatar_url?: string[];
    phone?: string[];
  };
  message?: string | null;
};

export async function createUser(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateUser.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
    email: formData.get('email'),
    full_name: formData.get('full_name'),
    user_type: formData.get('user_type'),
    avatar_url: formData.get('avatar_url'),
    phone: formData.get('phone'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User.',
    };
  }

  // Prepare data for insertion into the database
  const { username, password, email, full_name, user_type, avatar_url, phone } = validatedFields.data;
  const hashedPassword = await hashPassword(password); // Assuming you have a function to hash the password

  // Insert data into the database
  try {
    await sql`
      INSERT INTO users (username, password_hash, email, full_name, user_type, avatar_url, phone)
      VALUES (${username}, ${hashedPassword}, ${email}, ${full_name}, ${user_type}, ${avatar_url}, ${phone})
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
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateUser.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    full_name: formData.get('full_name'),
    user_type: formData.get('user_type'),
    avatar_url: formData.get('avatar_url'),
    phone: formData.get('phone'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update User.',
    };
  }

  const { username, email, full_name, user_type, avatar_url, phone } = validatedFields.data;

  try {
    await sql`
      UPDATE users
      SET username = ${username}, email = ${email}, full_name = ${full_name}, user_type = ${user_type}, avatar_url = ${avatar_url}, phone = ${phone}
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

export async function deleteUser(id: string) {
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    revalidatePath('/dashboard/users');
    return { message: 'Deleted User' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete User.' };
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