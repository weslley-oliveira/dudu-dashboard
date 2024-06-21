'use client';

import { CustomerField, Vehicle } from '@/app/lib/vehicles/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateVehicle } from '@/app/lib/vehicles/actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import VehicleCard from '@/app/ui/motos/vehicle-card';
import TextInput from '@/app/ui/motos/form/TextInput';

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
    year_registration?: string[];
    power?: string[];
    transmission?: string[];
    document_status?: string[];
    insurance_status?: string[];
    maintenance_status?: string[];
    mot?: string[];
    tracker?: string[];
    tracker_observation?: string[];
    color?: string[];
    sale_price?: string[];
    rental_price?: string[];
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
  const [tracker, setTracker] = useState(vehicle.tracker || false);

  const handleCompanyIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompanyId(e.target.value);
  };

  return (
    <form action={dispatch}>
      <VehicleCard vehicle={vehicle} />

      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <input type="hidden" name="plate" value={vehicle.plate} />
        <input type="hidden" name="make" value={vehicle.make} />
        <input type="hidden" name="type" value={vehicle.type} />
        <input type="hidden" name="series" value={vehicle.series} />
        <input type="hidden" name="model" value={vehicle.model} />
        <input type="hidden" name="vin" value={vehicle.vin} />
        <input type="hidden" name="engine_number" value={vehicle.engine_number} />
        <input type="hidden" name="year_of_manufacture" value={vehicle.year_of_manufacture} />

        <TextInput
          id="year_registration"
          name="year_registration"
          label="Year Registration"
          type="text"
          value={vehicle.year_registration}
          error={state.errors?.year_registration?.[0]}
        />

        <TextInput
          id="engine_capacity"
          name="engine_capacity"
          label="Engine Capacity"
          type="text"
          value={vehicle.specs?.engine_capacity || ''}
          error={state.errors?.engine_capacity?.[0]}
        />

        <TextInput
          id="power"
          name="power"
          label="Power"
          type="text"
          value={vehicle.specs?.power || ''}
          error={state.errors?.power?.[0]}
        />

        <TextInput
          id="transmission"
          name="transmission"
          label="Transmission"
          type="text"
          value={vehicle.specs?.transmission || ''}
          error={state.errors?.transmission?.[0]}
        />

        <TextInput
          id="fuel_type"
          name="fuel_type"
          label="Fuel Type"
          type="text"
          value={vehicle.specs?.fuel_type || ''}
          error={state.errors?.fuel_type?.[0]}
        />

        <TextInput
          id="color"
          name="color"
          label="Color"
          type="text"
          value={vehicle.specs?.color || ''}
          error={state.errors?.color?.[0]}
        />

        <TextInput
          id="mileage"
          name="mileage"
          label="Mileage"
          type="number"
          value={String(vehicle.specs?.mileage || 0)}
          error={state.errors?.mileage?.[0]}
        />

        <TextInput
          id="sale_price"
          name="sale_price"
          label="Sale Price"
          type="text"
          value={String(vehicle.price?.sale_price || '')}
          error={state.errors?.sale_price?.[0]}
        />

        <TextInput
          id="rental_price"
          name="rental_price"
          label="Rental Price"
          type="text"
          value={String(vehicle.price?.rental_price || '')}
          error={state.errors?.rental_price?.[0]}
        />

        <TextInput
          id="mot"
          name="mot"
          label="MOT"
          type="text"
          value={vehicle.mot}
          error={state.errors?.mot?.[0]}
        />

        <TextInput
          id="document_status"
          name="document_status"
          label="Document Status"
          type="text"
          value={vehicle.document_status}
          error={state.errors?.document_status?.[0]}
        />

        <TextInput
          id="insurance_status"
          name="insurance_status"
          label="Insurance Status"
          type="text"
          value={vehicle.insurance_status}
          error={state.errors?.insurance_status?.[0]}
        />

        <TextInput
          id="maintenance_status"
          name="maintenance_status"
          label="Maintenance Status"
          type="text"
          value={vehicle.maintenance_status}
          error={state.errors?.maintenance_status?.[0]}
        />

        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={vehicle.status || 'Available'}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="status-error"
          >
            <option value="Available">Available</option>
            <option value="to-rent">To Rent</option>
            <option value="to-sell">To Sell</option>
            <option value="to-fix">To Fix</option>
            <option value="to-storage">To Storage</option>
          </select>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="company_id" className="mb-2 block text-sm font-medium">
            Company
          </label>
          <select
            id="company_id"
            name="company_id"
            value={companyId}
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

        <TextInput
          id="observations"
          name="observations"
          label="Observations"
          type="text"
          value={vehicle.observations}
          error={state.errors?.observations?.[0]}
        />

        <div className="mb-4">
          <label htmlFor="tracker" className="mb-2 block text-sm font-medium">
            Tracker
          </label>
          <input
            id="tracker"
            name="tracker"
            type="checkbox"
            checked={tracker}
            onChange={(e) => setTracker(e.target.checked)}
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

        {tracker && (
          <TextInput
            id="tracker_observation"
            name="tracker_observation"
            label="Tracker Observation"
            type="text"
            value={vehicle.tracker_observation}
            error={state.errors?.tracker_observation?.[0]}
          />
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
