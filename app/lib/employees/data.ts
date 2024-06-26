import { sql } from '@vercel/postgres';
import { Employee, EmployeeField } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredEmployees(query: string, currentPage: number): Promise<Employee[]> {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<Employee>`
      SELECT
        e.id,
        e.user_id,
        u.full_name,
        u.phone,
        e.role,
        e.hire_date,
        e.salary,
        e.payment_day,
        e.created_at,
        e.updated_at
      FROM employees e
      JOIN users u ON e.user_id = u.id
      WHERE 
        u.full_name ILIKE ${'%' + query + '%'}
        OR e.role ILIKE ${'%' + query + '%'}
        OR e.hire_date::text ILIKE ${'%' + query + '%'}
        OR e.salary::text ILIKE ${'%' + query + '%'}
        OR e.payment_day::text ILIKE ${'%' + query + '%'}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    if (data.rows.length === 0) {
      
    }

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch employees.');
  }
}

export async function fetchEmployeesPages(query: string): Promise<number> {
  noStore();
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM employees e
      JOIN users u ON e.user_id = u.id
      WHERE 
        u.full_name ILIKE ${'%' + query + '%'}
        OR e.role ILIKE ${'%' + query + '%'}
        OR e.hire_date::text ILIKE ${'%' + query + '%'}
        OR e.salary::text ILIKE ${'%' + query + '%'}
        OR e.payment_day::text ILIKE ${'%' + query + '%'}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of employees.');
  }
}

export async function fetchEmployeeById(id: string): Promise<Employee | null> {
  noStore();
  try {
    const data = await sql<Employee>`
      SELECT
        e.id,
        e.user_id,
        u.full_name,
        u.email,
        u.phone,
        e.role,
        e.hire_date,
        e.salary,
        e.payment_day,
        e.created_at,
        e.updated_at
      FROM employees e
      JOIN users u ON e.user_id = u.id
      WHERE e.user_id = ${id};
    `;

    if (data.rows.length === 0) {
      return null;
    }

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
} 

export async function fetchEmployees() {
  noStore();
  try {
    const data = await sql<EmployeeField>`
      SELECT
        e.id,
        u.full_name AS name
      FROM employees e
      JOIN users u ON e.user_id = u.id
      ORDER BY u.full_name ASC
    `;

    const employees = data.rows;
    return employees;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all employees.');
  }
}