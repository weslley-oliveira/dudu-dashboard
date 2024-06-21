'use client';

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, ArrowLeftOnRectangleIcon, CalendarIcon, CheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createCustomer } from '@/app/lib/customers/actions';
import { useFormState } from 'react-dom';

export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(createCustomer, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Customer Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter customer name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-none placeholder:text-gray-500"
              aria-describedby="name-error"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter customer email"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-none placeholder:text-gray-500"
              aria-describedby="email-error"
            />
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Phone
          </label>
          <div className="relative">
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="Enter customer phone"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-none placeholder:text-gray-500"
              aria-describedby="phone-error"
            />
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="phone-error" aria-live="polite" aria-atomic="true">
            {state.errors?.phone &&
              state.errors.phone.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Address */}
        <div className="mb-4">
          <label htmlFor="address" className="mb-2 block text-sm font-medium">
            Address
          </label>
          <div className="relative">
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Enter customer address"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-none placeholder:text-gray-500"
              aria-describedby="address-error"
            />
            <ArrowLeftOnRectangleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="address-error" aria-live="polite" aria-atomic="true">
            {state.errors?.address &&
              state.errors.address.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Status */}
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Status
          </label>
          <div className="relative">
            <select
              id="status"
              name="status"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue="active"
              aria-describedby="status-error"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <CheckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Vehicle Plate */}
        <div className="mb-4">
          <label htmlFor="vehicle_plate" className="mb-2 block text-sm font-medium">
            Vehicle Plate
          </label>
          <div className="relative">
            <input
              id="vehicle_plate"
              name="vehicle_plate"
              type="text"
              placeholder="Enter vehicle plate"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-none placeholder:text-gray-500"
              aria-describedby="vehicle_plate-error"
            />
            <CreditCardIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="vehicle_plate-error" aria-live="polite" aria-atomic="true">
            {state.errors?.vehicle_plate &&
              state.errors.vehicle_plate.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              placeholder="Enter customer description"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-none placeholder:text-gray-500"
              aria-describedby="description-error"
            />
          </div>
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.descriptions &&
              state.errors.descriptions.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label htmlFor="date_of_birth" className="mb-2 block text-sm font-medium">
            Date of Birth
          </label>
          <div className="relative">
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-none placeholder:text-gray-500"
              aria-describedby="date_of_birth-error"
            />
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="date_of_birth-error" aria-live="polite" aria-atomic="true">
            {state.errors?.date_of_birth &&
              state.errors.date_of_birth.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
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
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Customer</Button>
      </div>
    </form>
  );
}
