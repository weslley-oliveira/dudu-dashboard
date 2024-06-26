'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';

const UserSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  full_name: z.string().min(1, { message: 'Full name is required.' }),
  phone: z.string().min(1, { message: 'Phone is required.' }),
});

const EmployeeSchema = z.object({
  role: z.string().min(1, { message: 'Role is required.' }),
  hire_date: z.string().optional(),
  salary: z.coerce.number().min(0, { message: 'Salary must be a positive number.' }),
  payment_day: z.coerce.number().min(1).max(31, { message: 'Payment day must be between 1 and 31.' }),
});

const CreateEmployee = EmployeeSchema.merge(UserSchema);

export type State = {
  errors?: {
    password?: string[];
    email?: string[];
    full_name?: string[];
    phone?: string[];
    role?: string[];
    hire_date?: string[];
    salary?: string[];
    payment_day?: string[];
  };
  message?: string | null;
};

export async function createEmployee(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedUserFields = UserSchema.safeParse({
    password: formData.get('password'),
    email: formData.get('email'),
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
  });

  const validatedEmployeeFields = EmployeeSchema.safeParse({
    role: formData.get('role'),
    hire_date: formData.get('hire_date'),
    salary: formData.get('salary'),
    payment_day: formData.get('payment_day'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedUserFields.success || !validatedEmployeeFields.success) {
    return {
      errors: {
        ...validatedUserFields.error?.flatten().fieldErrors,
        ...validatedEmployeeFields.error?.flatten().fieldErrors,
      },
      message: 'Missing Fields. Failed to Create Employee.',
    };
  }

  // Prepare data for insertion into the database
  const { password, email, full_name, phone } = validatedUserFields.data;
  const { role, hire_date, salary, payment_day } = validatedEmployeeFields.data;
  const hashedPassword = await hashPassword(password); // Assuming you have a function to hash the password

  // Insert user data into the database
  let userId: string;
  try {
    const userInsertResult = await sql`
      INSERT INTO users (password_hash, email, full_name, phone)
      VALUES (${hashedPassword}, ${email}, ${full_name}, ${phone})
      RETURNING id
    `;
    userId = userInsertResult.rows[0].id;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    console.error('Database Error:', error );
    if (error instanceof Error && error.message.includes('duplicate key value violates unique constraint "users_email_key"')) {
      return {
        errors: {
          email: ['Email is already in use.'],
        },
        message: 'Failed to Create User.',
      };
    }
    return {
      message: `Database Error: Failed to Create User.`,
    };
  }

  // Insert employee data into the database
  try {
    await sql`
      INSERT INTO employees (user_id, role, hire_date, salary, payment_day)
      VALUES (${userId}, ${role}, ${hire_date}, ${salary}, ${payment_day})
    `;
  } catch (error) {
    // If a database error occurs
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Employee.',
    };
  }

  // Revalidate the cache for the employees page and redirect the user.
  revalidatePath('/dashboard/employees');
  redirect('/dashboard/employees');
}

export async function updateEmployee(id: string, prevState: State, formData: FormData) {

  console.log("AQUI PA", formData)
  // Validate user fields using Zod
  const validatedUserFields = UserSchema.omit({ password: true }).safeParse({
    email: formData.get('email'),
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
  });

  if (!validatedUserFields.success) {
    return {
      errors: validatedUserFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update User.',
    };
  }

  const { email, full_name, phone } = validatedUserFields.data;

  try {
    await sql`
      UPDATE users
      SET email = ${email}, full_name = ${full_name}, phone = ${phone}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: `Database Error: Failed to Update User.${error}` };
  }

  // Validate employee fields using Zod
  const validatedEmployeeFields = EmployeeSchema.safeParse({
    role: formData.get('role'),
    hire_date: formData.get('hire_date'),
    salary: parseFloat(formData.get('salary') as string),
    payment_day: parseInt(formData.get('payment_day') as string, 10),
  });

  if (!validatedEmployeeFields.success) {
    return {
      errors: validatedEmployeeFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Employee.',
    };
  }

  const { role, hire_date, salary, payment_day } = validatedEmployeeFields.data;
  const updated_at = new Date().toISOString();

  try {
    await sql`
      UPDATE employees
      SET role = ${role}, hire_date = ${hire_date}, salary = ${salary}, payment_day = ${payment_day}, updated_at = ${updated_at}
      WHERE user_id = ${id}
    `;
  } catch (error) {
    return { message: `Database Error: ${hire_date} Failed to Update User.${error} MERDa` };
  }

  revalidatePath('/dashboard/employees');
  redirect('/dashboard/employees');
}

export async function deleteEmployee(id: string) {
  console.log('DELETAR O:', id)
  try {
    await sql`DELETE FROM employees WHERE user_id = ${id}`;
    await sql`DELETE FROM users WHERE id = ${id}`;
    revalidatePath('/dashboard/employees');
    return { message: 'Deleted Employee' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Employee.' };
  }
}

// Example function to hash passwords (using bcrypt for example)
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}