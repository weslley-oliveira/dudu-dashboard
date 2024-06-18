'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import { error } from 'console';

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
  vrn: z.string().nonempty(),
  make: z.string().nonempty(),
  Series: z.string().nonempty(),
  mileage: z.number().nonnegative(),
  observacoes: z.string().optional(),
  modelvariant: z.string().nonempty(),
  EngineCapacity: z.string().nonempty(),
  Vin: z.string().nonempty(),
  EngineNumber: z.string().nonempty(),
  FuelType: z.string().nonempty(),
  status: z.enum(['available', 'rented', 'under_maintenance', 'sold']),
  availability: z.string().nonempty(),
  company_id: z.number().int(),
  YearOfManufacture: z.number().int().nonnegative(),
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
    vrn: formData.get('vrn'),
    make: formData.get('make'),
    te: formData.get('te'),
    Series: formData.get('Series'),
    mileage: Number(formData.get('mileage')),
    observacoes: formData.get('observacoes'),
    modelvariant: formData.get('modelvariant'),
    EngineCapacity: formData.get('EngineCapacity'),
    SysSetupDate: formData.get('SysSetupDate'),
    Vin: formData.get('Vin'),
    EngineNumber: formData.get('EngineNumber'),
    FuelType: formData.get('FuelType'),
    status: formData.get('status'),
    availability: formData.get('availability'),
    company_id: Number(formData.get('company_id')),
    YearOfManufacture: Number(formData.get('YearOfManufacture')),
  });

  // Se a validação do formulário falhar, retornar erros imediatamente.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: `Missing Fields. Failed to Create Vehicle.${error}`,
    };
  }

  // Preparar os dados para inserção no banco de dados
  const {
    vrn,
    make,
    Series,
    mileage,
    observacoes,
    modelvariant,
    EngineCapacity,
    Vin,
    EngineNumber,
    FuelType,
    status,
    availability,
    company_id,
    YearOfManufacture,
  } = validatedFields.data;

  // Inserir os dados no banco de dados
  try {
    await sql`
      INSERT INTO vehicles (
        VRN, Make, Series, mileage, observacoes, ModelVariant, EngineCapacity, Vin, EngineNumber, FuelType, status, availability, company_id, YearOfManufacture
      ) VALUES (
        ${vrn}, ${make}, ${Series}, ${mileage}, ${observacoes}, ${modelvariant}, ${EngineCapacity}, ${Vin}, ${EngineNumber}, ${FuelType}, ${status}, ${availability}, ${company_id}, ${YearOfManufacture}
      )
    `;
  } catch (error) {
    // Se ocorrer um erro no banco de dados, retornar um erro mais específico.
    return {
      message: 'Database Error: Failed to Create Vehicle.',
    };
  }

  // Revalidar o cache para a página de veículos e redirecionar o usuário.
  revalidatePath('/dashboard/motos');
  redirect('/dashboard/motos');
}

export async function updateVehicle(
  vrn: string,
  prevState: State,
  formData: FormData,
) {
  // Extraindo os campos do formulário
  const vehicleData = {
    make: formData.get('make') as string | null,
    te: formData.get('te') as string | null,
    series: formData.get('series') as string | null,
    mileage: formData.get('mileage') as string | null,
    observacoes: formData.get('observacoes') as string | null,
    modelvariant: formData.get('modelvariant') as string | null,
    enginecapacity: formData.get('enginecapacity') as string | null,
    syssetupdate: formData.get('syssetupdate') as string | null,
    vin: formData.get('vin') as string | null,
    enginenumber: formData.get('enginenumber') as string | null,
    fueltype: formData.get('fueltype') as string | null,
    status: formData.get('status') as string | null,
    availability: formData.get('availability') as string | null,
    company_id: formData.get('company_id') as string | null,
    yearofmanufacture: formData.get('yearofmanufacture') as string | null
  };

  // Verificando campos obrigatórios
  for (const [key, value] of Object.entries(vehicleData)) {
    if (!value) {
      return {
        errors: { [key]: [`${key} is required`] },
        message: `Missing Fields. Failed to Update Vehicle.${error}`,
      };
    }
  }

  try {
    await sql`
      UPDATE vehicles
      SET 
        make = ${vehicleData.make},
        te = ${vehicleData.te},
        series = ${vehicleData.series},
        mileage = ${vehicleData.mileage},
        observacoes = ${vehicleData.observacoes},
        modelvariant = ${vehicleData.modelvariant},
        enginecapacity = ${vehicleData.enginecapacity},
        syssetupdate = ${vehicleData.syssetupdate},
        vin = ${vehicleData.vin},
        enginenumber = ${vehicleData.enginenumber},
        fueltype = ${vehicleData.fueltype},
        status = ${vehicleData.status},
        availability = ${vehicleData.availability},
        company_id = ${vehicleData.company_id},
        yearofmanufacture = ${vehicleData.yearofmanufacture}
      WHERE vrn = ${vrn}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Vehicle.' };
  }

  revalidatePath('/dashboard/motos');
  redirect('/dashboard/motos');
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
