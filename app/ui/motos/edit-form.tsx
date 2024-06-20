'use client';

import { CustomerField, Vehicle } from '@/app/lib/vehicles/definitions';
import {
  CheckIcon,
  ClockIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateVehicle } from '@/app/lib/vehicles/actions';
import { useFormState } from 'react-dom';
import VehicleCard from './vehicle-card';
import { useState } from 'react';

type State = {
  errors?: {
    plate?: string[];
    make?: string[];
    type?: string[];
    series?: string[];
    mileage?: string[];
    observations?: string[];
    model?: string[];
    engine_capacity?: string[];
    vin?: string[];
    engine_number?: string[];
    fuel_type?: string[];
    status?: string[];
    company_id?: string[];
    year_of_manufacture?: string[];
    mot?: string[];
    tracker?: string[];
    tracker_observation?: string[];
    color?: string[];
  };
  message: string;
};

export default function EditVehicleForm({
  vehicle,
  customers,
}: {
  vehicle: Vehicle;
  customers: CustomerField[];
}) {
  const initialState: State = { message: '', errors: {} };
  const updateVehicleWithId = async (prevState: State, formData: FormData) => updateVehicle(vehicle.id, prevState, formData);
  const [state, dispatch] = useFormState(updateVehicleWithId, initialState);

  const [companyId, setCompanyId] = useState(vehicle.company_id || '');

const handleCompanyIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setCompanyId(e.target.value);
};


  return (
    <form action={dispatch}>
      <VehicleCard vehicle={vehicle} />
       {/* Hidden fields to pass vehicle data for validation */}
       <input type="hidden" name="plate" value={vehicle.plate} />
          <input type="hidden" name="make" value={vehicle.make} />
          <input type="hidden" name="type" value={vehicle.type} />
          <input type="hidden" name="series" value={vehicle.series} />
          <input type="hidden" name="model" value={vehicle.model} />
          <input type="hidden" name="engine_capacity" value={vehicle.engine_capacity} />
          <input type="hidden" name="vin" value={vehicle.vin} />
          <input type="hidden" name="engine_number" value={vehicle.engine_number} />
          <input type="hidden" name="fuel_type" value={vehicle.fuel_type} />
          <input type="hidden" name="year_of_manufacture" value={vehicle.year_of_manufacture} />
          <input type="hidden" name="color" value={vehicle.color} />

      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* MOT */}
<div className="mb-4">
  <label htmlFor="mot" className="mb-2 block text-sm font-medium">
    MOT
  </label>
  <input
    id="mot"
    name="mot"
    type="text"
    defaultValue={vehicle.mot}
    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
    aria-describedby="mot-error"
  />
  <div id="mot-error" aria-live="polite" aria-atomic="true">
    {state.errors?.mot &&
      state.errors.mot.map((error: string) => (
        <p className="mt-2 text-sm text-red-500" key={error}>
          {error}
        </p>
      ))}
  </div>
</div>
        {/* Plate */}
        <div className="mb-4">
          <label htmlFor="plate" className="mb-2 block text-sm font-medium">
            Plate
          </label>
          <input
            id="plate"
            name="plate"
            type="text"
            defaultValue={vehicle.plate}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="plate-error"
          />
          <div id="plate-error" aria-live="polite" aria-atomic="true">
            {state.errors?.plate &&
              state.errors.plate.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Make */}
        <div className="mb-4">
          <label htmlFor="make" className="mb-2 block text-sm font-medium">
            Make
          </label>
          <input
            id="make"
            name="make"
            type="text"
            defaultValue={vehicle.make}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="make-error"
          />
          <div id="make-error" aria-live="polite" aria-atomic="true">
            {state.errors?.make &&
              state.errors.make.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Model */}
        <div className="mb-4">
          <label htmlFor="model" className="mb-2 block text-sm font-medium">
            Model
          </label>
          <input
            id="model"
            name="model"
            type="text"
            defaultValue={vehicle.model}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="model-error"
          />
          <div id="model-error" aria-live="polite" aria-atomic="true">
            {state.errors?.model &&
              state.errors.model.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Color */}
        <div className="mb-4">
          <label htmlFor="color" className="mb-2 block text-sm font-medium">
            Color
          </label>
          <input
            id="color"
            name="color"
            type="text"
            defaultValue={vehicle.color}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="color-error"
          />
          <div id="color-error" aria-live="polite" aria-atomic="true">
            {state.errors?.color &&
              state.errors.color.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Mileage */}
        <div className="mb-4">
          <label htmlFor="mileage" className="mb-2 block text-sm font-medium">
            Mileage
          </label>
          <input
            id="mileage"
            name="mileage"
            type="number"
            defaultValue={vehicle.mileage}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="mileage-error"
          />
          <div id="mileage-error" aria-live="polite" aria-atomic="true">
            {state.errors?.mileage &&
              state.errors.mileage.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Status
          </label>
          <input
            id="status"
            name="status"
            type="text"
            defaultValue={vehicle.status}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="status-error"
          />
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

       {/* Company */}
<div className="mb-4">
  <label htmlFor="company_id" className="mb-2 block text-sm font-medium">
    Company
  </label>
  <select
    id="company_id"
    name="company_id"
    value={companyId} // Define o valor padrão para o select
    onChange={handleCompanyIdChange}
    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
  >
    <option value="">Select a company</option>
    {customers.map((customer) => (
      <option key={customer.id} value={customer.id}>
        {customer.name}
      </option>
    ))}
  </select>
  <div id="company_id-error" aria-live="polite" aria-atomic="true">
    {state.errors?.company_id &&
      state.errors.company_id.map((error: string) => (
        <p className="mt-2 text-sm text-red-500" key={error}>
          {error}
        </p>
      ))}
  </div>
</div>

        {/* Observations */}
        <div className="mb-4">
          <label htmlFor="observations" className="mb-2 block text-sm font-medium">
            Observations
          </label>
          <textarea
            id="observations"
            name="observations"
            defaultValue={vehicle.observations}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="observations-error"
          />
          <div id="observations-error" aria-live="polite" aria-atomic="true">
            {state.errors?.observations &&
              state.errors.observations.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Tracker */}
        <div className="mb-4">
          <label htmlFor="tracker" className="mb-2 block text-sm font-medium">
            Tracker
          </label>
          <input
            id="tracker"
            name="tracker"
            type="checkbox"
            defaultChecked={vehicle.tracker}
            className="peer block rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="tracker-error"
          />
          <div id="tracker-error" aria-live="polite" aria-atomic="true">
            {state.errors?.tracker &&
              state.errors.tracker.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Tracker Observation */}
        {vehicle.tracker && (
          <div className="mb-4">
            <label htmlFor="tracker_observation" className="mb-2 block text-sm font-medium">
              Tracker Observation
            </label>
            <input
              id="tracker_observation"
              name="tracker_observation"
              type="text"
              defaultValue={vehicle.tracker_observation}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="tracker_observation-error"
            />
           
          </div>
        )}

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="my-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/motos"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Vehicle</Button>
      </div>
    </form>
  );
}
