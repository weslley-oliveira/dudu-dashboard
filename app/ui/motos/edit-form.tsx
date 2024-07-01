'use client';

import { CustomerField, Vehicle } from '@/app/lib/vehicles/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateVehicle } from '@/app/lib/vehicles/actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import VehicleCard from '@/app/ui/motos/vehicle-card';
import TextInput from '@/app/ui/motos/form/TextInput';
import { fetchVehicleData } from '@/app/lib/vehicles/data';

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
  const [plate, setPlate] = useState('');
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);
  const [tracker, setTracker] = useState(false);
  const [trackerObservation, setTrackerObservation] = useState('');
  const [status, setStatus] = useState('Available');
  const [documentStatus, setDocumentStatus] = useState('valid');
  const [insuranceStatus, setInsuranceStatus] = useState('active');

  console.log("moto",vehicle)

  const handleInsuranceStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInsuranceStatus(e.target.value);
  };
  
    const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlate(e.target.value);
    };
  
    const handleFetchData = async () => {
      try {
        const data: Vehicle = await fetchVehicleData(plate);
        setVehicleData(data);
      } catch (error) {
        console.error('Erro ao buscar dados do veículo:', error);
      }
    };
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    };
  
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatus(e.target.value);
    };
  
    const handleDocumentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDocumentStatus(e.target.value);
    };
  

  return (
    <form action={dispatch}  onKeyDown={handleKeyDown}>
    <VehicleCard vehicle={vehicle} />


  <>
    {/* Hidden fields to pass vehicle data for validation */}
    <input type="hidden" name="plate" value={vehicle.plate} />
    <input type="hidden" name="make" value={vehicle.make} />
    <input type="hidden" name="model" value={vehicle.model} />
    <input type="hidden" name="series" value={vehicle.series} />
    <input type="hidden" name="type" value={vehicle.type} />
    <input type="hidden" name="year_of_manufacture" value={vehicle.year_of_manufacture} />
    <input type="hidden" name="year_registration" value={vehicle.year_registration} />
    <input type="hidden" name="engine_capacity" value={vehicle.engine_capacity || ''} />
    <input type="hidden" name="power" value={vehicle.power || ''} />
    <input type="hidden" name="transmission" value={vehicle.transmission || ''} />
    <input type="hidden" name="fuel_type" value={vehicle.fuel_type || ''} />
    <input type="hidden" name="color" value={vehicle.color || ''} />
    <input type="hidden" name="vin" value={vehicle.vin} />
    <input type="hidden" name="engine_number" value={vehicle.engine_number} />
    <input type="hidden" name="maintenance_status" value={vehicle.maintenance_status || ''} />
    <input type="hidden" name="tracker_observation" value={vehicle.tracker_observation || ''} />

    {/* Editable Fields */}
    <TextInput
      id="mileage"
      name="mileage"
      label="Mileage"
      type="number"
      placeholder="Enter mileage"
      value={String(vehicle.mileage || 0)}
      error={state.errors?.mileage?.[0]}
    />

    <div className='flex gap-2 w-full'>
      <TextInput
        id="sale_price"
        name="sale_price"
        label="Sale Price"
        type="number"
        placeholder="Enter sale price"
        value={vehicle.sale_price || ''}
        error={state.errors?.sale_price?.[0]}
      />

      <TextInput
        id="rental_price"
        name="rental_price"
        label="Rental Price"
        type="number"
        placeholder="Enter rental price"
        value={String(vehicle.rental_price || '')}
        error={state.errors?.rental_price?.[0]}
      />
    </div>

    {/* MOT */}
    <div className="mb-4">
      <label htmlFor="mot" className="mb-2 block text-sm font-medium">
        MOT until
      </label>
      <input
        id="mot"
        name="mot"
        type="date"
        defaultValue={vehicle?.mot || ''}
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

    <div className="mb-4">
      <label htmlFor="status" className="mb-2 block text-sm font-medium">
        Status
      </label>
      <select
        id="status"
        name="status"
        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        value={status}
        onChange={handleStatusChange}
        aria-describedby="status-error"
      >
        <option value="Available">Available</option>
        <option value="rented">Rented</option>
        <option value="sold">Sold</option>
        <option value="private-storage">Private Storage</option>
        <option value="claim-storage">Claim Storage</option>
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
      <label htmlFor="document_status" className="mb-2 block text-sm font-medium">
        Document Status
      </label>
      <select
        id="document_status"
        name="document_status"
        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        value={documentStatus}
        onChange={handleDocumentStatusChange}
        aria-describedby="document_status-error"
      >
        <option value="valid">Valid</option>
        <option value="waiting-document">Waiting Document</option>
      </select>
      <div id="document_status-error" aria-live="polite" aria-atomic="true">
        {state.errors?.document_status &&
          state.errors.document_status.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>

    <div className="mb-4">
<label htmlFor="insurance_status" className="mb-2 block text-sm font-medium">
Insurance Status
</label>
<select
id="insurance_status"
name="insurance_status"
className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
value={insuranceStatus}
onChange={handleInsuranceStatusChange}
aria-describedby="insurance_status-error"
>
<option value="active">Active</option>
<option value="expired">Expired</option>
</select>
<div id="insurance_status-error" aria-live="polite" aria-atomic="true">
{state.errors?.insurance_status &&
state.errors.insurance_status.map((error: string) => (
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
        defaultValue={vehicle.company_id}
        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
      >
        <option value=''>Select a company</option>
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
      placeholder="Enter observations"
      value={vehicle.observations || ''}
      error={state.errors?.observations?.[0]}
    />

    <div className="mb-4 flex gap-2 items-stretch">
      <label htmlFor="tracker" className="mb-2 block text-sm font-medium">
        Tracker
      </label>
      <input
        id="tracker"
        name="tracker"
        type="checkbox"
        checked={tracker}
        onChange={(e) => setTracker(e.target.checked)}
        className="rounded-sm border border-gray-300 h-4 w-4 text-sm placeholder:text-gray-500"
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
        placeholder="Enter Tracker Observation"
        value={trackerObservation}
        error={state.errors?.tracker_observation?.[0]}
        onChange={(e) => setTrackerObservation(e.target.value)}
      />
    )}

    <div aria-live="polite" aria-atomic="true">
      {state.message ? (
        <p className="mt-2 text-sm text-green-500">{state.message}</p>
      ) : null}
    </div>

    <div className="mt-6 flex justify-end gap-4">
      <Link
        href="/dashboard/inventory/vehicles"
        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
      >
        Cancel
      </Link>
      <Button type="submit">Update Vehicle</Button>
    </div>
  </>
    </form>
  );
}
