// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  type: string;
  series: string;
  mileage: number;
  observations?: string;
  model: string;
  engine_capacity: string;
  vin: string;
  engine_number: string;
  fuel_type: string;
  status: string;
  company_id?: string | null;
  year_of_manufacture: number;
  mot?: string;
  tracker?: boolean;
  tracker_observation?: string;
  color: string;
}



export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  type: string;
  series: string;
  mileage: number;
  observations?: string;
  model: string;
  engine_capacity: string;
  vin: string;
  engine_number: string;
  fuel_type: string;
  status: string;
  company_id?: string | null;
  year_of_manufacture: number;
  mot?: string;
  tracker?: boolean;
  tracker_observation?: string;
  color: string;
}

export interface Product {
  id: string;
  product_name: string;
  product_code: string;
  category: string;
  manufacturer: string;
  price: number;
  stock: number;
  status: string;
  observations: string | null;
}

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};