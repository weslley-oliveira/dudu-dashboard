'use client';

import { useState } from 'react';
import { CustomerField } from '@/app/lib/customers/definitions';
import { Vehicle } from '@/app/lib/vehicles/definitions';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateRental } from '@/app/lib/rentals/actions';
import { useFormState } from 'react-dom';
import { formatDateToInput } from '@/app/lib/utils';

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

export default function EditRentalForm({
  rental,
  customers,
  vehicles,
}: {
  rental: any;
  customers: CustomerField[];
  vehicles: Vehicle[];
}) {
  const initialState: State = { message: '', errors: {} };
  const updateRentalWithId = async (prevState: State, formData: FormData) => updateRental(rental.id, prevState, formData);
  const [state, dispatch] = useFormState(updateRentalWithId, initialState);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(vehicles.find(v => v.id === rental.vehicle_id) || null);
  const [total, setTotal] = useState<number | string>(rental.total);

  const handleVehicleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const vehicleId = event.target.value;
    const vehicle = vehicles.find(v => v.id === vehicleId) || null;
    setSelectedVehicle(vehicle);
    setTotal(vehicle?.rental_price || '');
  };

  const handleTotalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTotal(event.target.value);
  };

  const endDateTimestamp = rental.endDate ? new Date(rental.endDate).toISOString() : null;
  console.log("TETETesda", endDateTimestamp)
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
              defaultValue={rental.customer_id}
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
              defaultValue={rental.vehicle_id}
              aria-describedby="vehicle-error"
              onChange={handleVehicleChange}
            >
              <option value="" disabled>
                Select a vehicle
              </option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.registration} - {vehicle.make} {vehicle.model}
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
              defaultValue={formatDateToInput(rental.startDate)}
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

        {/* End Date */}
        <div className="mb-4">
          <label htmlFor="endDate" className="mb-2 block text-sm font-medium">
            End Date
          </label>
          <div className="relative">
            <input
              id="endDate"
              name="endDate"
              type="date"
              defaultValue={formatDateToInput(rental.endDate) || " "}
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

        {/* Day Payment */}
        <div className="mb-4">
          <label htmlFor="daypayment" className="mb-2 block text-sm font-medium">
            Day Payment
          </label>
          <div className="relative">
            <select
              id="daypayment"
              name="daypayment"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={rental.daypayment || ''}
              aria-describedby="daypayment-error"
            >
              <option value="" disabled>
                Select a day
              </option>
              <option value="sunday">Sunday</option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
            </select>
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
              value={total}
              onChange={handleTotalChange}
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
        <Button type="submit">Edit Rental</Button>
      </div>
    </form>
  );
}
