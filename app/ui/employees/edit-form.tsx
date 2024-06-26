'use client';

import { Employee } from '@/app/lib/employees/definitions';
import {
  IdentificationIcon,
  AtSymbolIcon,
  UserCircleIcon,
  PhoneIcon,
  UserGroupIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateEmployee } from '@/app/lib/employees/actions';
import { useFormState } from 'react-dom';

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

export default function EditEmployeeForm({
  employee,
}: {
  employee: Employee;
}) {
  const initialState  = { message: '', errors: {} };
  const updateEmployeeWithId = async (prevState: State, formData: FormData) => updateEmployee(employee.user_id, prevState, formData);
  const [state, dispatch] = useFormState(updateEmployeeWithId, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="full_name" className="mb-2 block text-sm font-medium">
            Full Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="full_name"
                name="full_name"
                type="text"
                defaultValue={employee.full_name}
                placeholder="Enter Full Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="full_name-error"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={employee.email}
                placeholder="Enter Email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Phone
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={employee.phone}
                placeholder="Enter Phone Number"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="phone-error"
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Role */}
        <div className="mb-4">
          <label htmlFor="role" className="mb-2 block text-sm font-medium">
            Role
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id="role"
                name="role"
                defaultValue={employee.role}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="role-error"
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="mechanic">Mechanic</option>
                <option value="attendant">Attendant</option>
                <option value="secretary">Secretary</option>
                <option value="accountant">Accountant</option>
              </select>
              <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Hire Date */}
        <div className="mb-4">
          <label htmlFor="hire_date" className="mb-2 block text-sm font-medium">
            Hire Date
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="hire_date"
                name="hire_date"
                type="date"
                defaultValue={
                  employee.hire_date
                    ? new Date(employee.hire_date).toLocaleDateString('en-CA')  // Formato 'YYYY-MM-DD' compatível com input date
                    : ''
                }
                placeholder="Enter Hire Date"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="hire_date-error"
              />
              <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="mb-4">
          <label htmlFor="salary" className="mb-2 block text-sm font-medium">
            Salary
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="salary"
                name="salary"
                type="number"
                step="0.01"
                defaultValue={employee.salary}
                placeholder="Enter Salary"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="salary-error"
              />
              <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Payment Day */}
        <div className="mb-4">
          <label htmlFor="payment_day" className="mb-2 block text-sm font-medium">
            Payment Day
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="payment_day"
                name="payment_day"
                type="number"
                min="1"
                max="31"
                defaultValue={employee.payment_day}
                placeholder="Enter Payment Day"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="payment_day-error"
              />
              <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/employees"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update Employee</Button>
      </div>
    </form>
  );
}
