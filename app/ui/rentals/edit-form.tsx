'use client';

import { Rental } from '@/app/lib/rentals/definitions';
import { VehicleField } from '@/app/lib/vehicles/definitions';
import { CustomerField } from '@/app/lib/customers/definitions';
import { UserCircleIcon, TruckIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateRental } from '@/app/lib/rentals/actions';
import { useFormState } from 'react-dom';

type State = {
  errors?: {
    customerId?: string[];
    vehicleId?: string[];
    startDate?: string[];
    endDate?: string[];
    total?: string[];
    daypayment?: string[];
  };
  message: string;
};

export default function EditRentalForm({ rental, customers, vehicles }: { rental: Rental; customers: CustomerField[]; vehicles: VehicleField[] }) {
  const initialState: State = { message: '', errors: {} };
  const updateRentalWithId = async (prevState: State, formData: FormData) => updateRental(rental.id, prevState, formData);
  const [state, dispatch] = useFormState(updateRentalWithId, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer ID */}
        <div className="mb-4">
          <label htmlFor="customerId" className="mb-2 block text-sm font-medium">
            Customer
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="customerId"
              name="customerId"
              defaultValue={rental.customerId}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="customerId-error"
            >
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="customerId-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Vehicle ID */}
        <div className="mb-4">
          <label htmlFor="vehicleId" className="mb-2 block text-sm font-medium">
            Vehicle
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="vehicleId"
              name="vehicleId"
              defaultValue={rental.vehicleId}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="vehicleId-error"
            >
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model}
                </option>
              ))}
            </select>
            <TruckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="vehicleId-error" aria-live="polite" aria-atomic="true">
            {state.errors?.vehicleId &&
              state.errors.vehicleId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label htmlFor="startDate" className="mb-2 block text-sm font-medium">
            Start Date
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="startDate"
              name="startDate"
              type="datetime-local"
              defaultValue={new Date(rental.startDate).toISOString().slice(0, 16)}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="startDate-error"
            />
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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

        {/* End Date */}
        <div className="mb-4">
          <label htmlFor="endDate" className="mb-2 block text-sm font-medium">
            End Date
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="endDate"
              name="endDate"
              type="datetime-local"
              defaultValue={new Date(rental.endDate).toISOString().slice(0, 16)}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="endDate-error"
            />
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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

        {/* Total */}
        <div className="mb-4">
          <label htmlFor="total" className="mb-2 block text-sm font-medium">
            Total Amount
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="total"
              name="total"
              type="number"
              step="0.01"
              defaultValue={rental.total}
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

        {/* Day Payment */}
        <div className="mb-4">
          <label htmlFor="daypayment" className="mb-2 block text-sm font-medium">
            Day Payment
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="daypayment"
              name="daypayment"
              type="date"
              defaultValue={new Date(rental.daypayment).toISOString().slice(0, 16)}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="daypayment-error"
            />
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
      <Button type="submit">Edit Company</Button>
    </div>
  </form>
  
  );
}