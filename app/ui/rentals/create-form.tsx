'use client';

import { CustomerField } from '@/app/lib/customers/definitions';
import { VehicleField } from '@/app/lib/vehicles/definitions';
import Link from 'next/link';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createRental } from '@/app/lib/rentals/actions';
import { useFormState } from 'react-dom';

export default function Form({ customers, vehicles }: { customers: CustomerField[], vehicles: VehicleField[] }) {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(createRental, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Selection */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="mb-4">
          <label htmlFor="vehicle" className="mb-2 block text-sm font-medium">
            Choose vehicle
          </label>
          <div className="relative">
            <select
              id="vehicle"
              name="vehicleId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="vehicle-error"
            >
              <option value="" disabled>
                Select a vehicle
              </option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} ({vehicle.plate})
                </option>
              ))}
            </select>
            <TruckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="vehicle-error" aria-live="polite" aria-atomic="true">
            {state.errors?.vehicleId &&
              state.errors.vehicleId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Rental Start Date */}
        <div className="mb-4">
          <label htmlFor="startDate" className="mb-2 block text-sm font-medium">
            Start Date
          </label>
          <div className="relative">
            <input
              id="startDate"
              name="startDate"
              type="date"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="startDate-error"
            />
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="startDate-error" aria-live="polite" aria-atomic="true">
            {state.errors?.startDate &&
              state.errors.startDate.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* end date DAY */}
        <div className="mb-4">
          <label htmlFor="endDate" className="mb-2 block text-sm font-medium">
            End Date
          </label>
          <div className="relative">
            <input
              id="endDate"
              name="endDate"
              type="date"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="endDate-error"
            />
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="endDate-error" aria-live="polite" aria-atomic="true">
            {state.errors?.endDate &&
              state.errors.endDate.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


        {/* Day payment */}
        <div className="mb-4">
          <label htmlFor="daypayment" className="mb-2 block text-sm font-medium">
            Day Payment
          </label>
          <div className="relative">
            <input
              id="daypayment"
              name="daypayment"
              type="date"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="daypayment-error"
            />
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="daypayment-error" aria-live="polite" aria-atomic="true">
            {state.errors?.daypayment &&
              state.errors.daypayment.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Total Amount */}
        <div className="mb-4">
          <label htmlFor="total" className="mb-2 block text-sm font-medium">
            Total Amount
          </label>
          <div className="relative">
            <input
              id="total"
              name="total"
              type="number"
              step="0.01"
              placeholder="Enter USD amount"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="total-error"
            />
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>

          <div id="total-error" aria-live="polite" aria-atomic="true">
            {state.errors?.total &&
              state.errors.total.map((error: string) => (
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
          href="/dashboard/rentals"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Rental</Button>
      </div>
    </form>
  );
}