import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  Vehicle,
  Product,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}



export async function fetchLatestInvoices() {
  noStore();
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5
    `;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchFilteredVehicles(query: string, currentPage: number): Promise<Vehicle[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const result = await sql<Vehicle>`
      SELECT
        id,
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
        tracker,
        tracker_observation,
        color
      FROM vehicles
      WHERE
        plate ILIKE ${`%${query}%`} OR
        make ILIKE ${`%${query}%`} OR
        model ILIKE ${`%${query}%`} OR
        status ILIKE ${`%${query}%`} OR
        year_of_manufacture::text ILIKE ${`%${query}%`}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vehicles.');
  }
}

export async function fetchFilteredUsers(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const searchQuery = `%${query}%`;

    const users = await sql<User>`
    SELECT
      users.id,
      users.name,
      users.email
    FROM users
    WHERE
      users.name ILIKE ${searchQuery} OR
      users.email ILIKE ${searchQuery}
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return users.rows;
  } catch (error) {
    console.error('Esse:', error);
    throw new Error('Failed to fetch users.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchVehiclesPages(query: string) {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM vehicles
      WHERE
        plate ILIKE ${`%${query}%`} OR
        make ILIKE ${`%${query}%`} OR
        model ILIKE ${`%${query}%`} OR
        status ILIKE ${`%${query}%`} OR
        year_of_manufacture::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of vehicles.');
  }
}

export async function fetchUsersPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM users
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchVehicleById(id: string): Promise<Vehicle> {
  noStore();
  try {
    const data = await sql<Vehicle>`
      SELECT
        id,
        plate,
        make,
        type,
        series,
        mileage,
        observations AS observacoes,
        model AS ModelVariant,
        engine_capacity AS EngineCapacity,
        vin,
        engine_number AS EngineNumber,
        fuel_type AS FuelType,
        status,
        company_id,
        year_of_manufacture AS YearOfManufacture,
        mot,
        tracker,
        tracker_observation AS trackerObservation,
        color
      FROM vehicles
      WHERE id = ${id};
    `;

    if (data.rows.length === 0) {
      throw new Error('Vehicle not found.');
    }

    const vehicle = data.rows.map((vehicle) => ({
      ...vehicle
    }));

    return vehicle[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vehicle.');
  }
}

export async function fetchUserById(id: string) {
  noStore();
  try {
    const data = await sql<User>`
      SELECT
        users.id,
        users.name,
        users.email,
        users.password
      FROM users
      WHERE users.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}


export const fetchVehicleData = async (plate: string): Promise<Vehicle> => {
  const apiKey = '06a0f54d-44ea-404b-8978-7f519f4f4534';
  const url = `https://uk1.ukvehicledata.co.uk/api/datapackage/VehicleAndMotHistory?v=2&api_nullitems=1&auth_apikey=${apiKey}&key_VRM=${plate}`;
  const response = await fetch(url);
  const data = await response.json();

  console.log(response, "Ta aqui de verdade");

  return {
    id: '', // O ID será gerado pelo banco de dados
    plate: data.Request.DataKeys.Vrm,
    make: data.Response.DataItems.VehicleRegistration.Make,
    model: data.Response.DataItems.SmmtDetails.ModelVariant, // Usando o Model Variant para o campo Model
    series: data.Response.DataItems.SmmtDetails.Series,
    engine_capacity: data.Response.DataItems.VehicleRegistration.EngineCapacity,
    vin: data.Response.DataItems.VehicleRegistration.Vin,
    year_of_manufacture: parseInt(data.Response.DataItems.VehicleRegistration.YearOfManufacture),
    engine_number: data.Response.DataItems.VehicleRegistration.EngineNumber,
    fuel_type: data.Response.DataItems.VehicleRegistration.FuelType,
    color: data.Response.DataItems.VehicleRegistration.Colour,
    type: data.Response.DataItems.VehicleRegistration.VehicleClass || '', // Adicionando type
    mileage: 0,
    status: '',
    company_id: '',
    observations: '',
    mot: '',
  };
};

export async function fetchFilteredProducts(query: string): Promise<Product[]> {
  noStore();
  try {
    const data = await sql<Product>`
      SELECT
        id,
        product_name,
        product_code,
        category,
        manufacturer,
        price,
        stock,
        status,
        observations
      FROM products
      WHERE 
        product_name ILIKE ${'%' + query + '%'}
        OR product_code ILIKE ${'%' + query + '%'}
        OR category ILIKE ${'%' + query + '%'}
        OR manufacturer ILIKE ${'%' + query + '%'}
        OR status ILIKE ${'%' + query + '%'}
        OR observations ILIKE ${'%' + query + '%'};
    `;

    if (data.rows.length === 0) {
      throw new Error('No products found.');
    }

    const products = data.rows.map((product) => ({
      ...product
    }));

    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}