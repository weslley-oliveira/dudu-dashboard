'use client';
import React, { useState } from 'react';
import { Vehicle } from '@/app/lib/vehicles/definitions';
import { CustomerField } from '@/app/lib/customers/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateVehicle } from '@/app/lib/vehicles/actions';
import { useFormState } from 'react-dom';
import VehicleCard from '@/app/ui/vehicles/vehicle-card';
import TextInput from '@/app/ui/vehicles/form/TextInput';
import UkLicensePlate from '../UkLicensePlate';
import { FaMotorcycle } from 'react-icons/fa';
import { getYearFromDate } from '@/app/lib/utils';

type State = {
  errors?: {
    [key: string]: string[];
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
  const updateVehicleWithId = async (prevState: State, formData: FormData) =>
    updateVehicle(vehicle.id, prevState, formData);
  const [state, dispatch] = useFormState(updateVehicleWithId, initialState);

  const [status, setStatus] = useState(vehicle.status || 'Available');
  const [documentStatus, setDocumentStatus] = useState(vehicle.document_status || 'valid');
  const [insuranceStatus, setInsuranceStatus] = useState(vehicle.insurance_status || 'active');
  const [tracker, setTracker] = useState(vehicle.tracker || false);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleDocumentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentStatus(e.target.value);
  };

  const handleInsuranceStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInsuranceStatus(e.target.value);
  };

  return (
    <form action={dispatch}>
      <div className="py-4">
        <div className=''>
          <UkLicensePlate plateNumber={`${vehicle.registration}`} />
          <div className='py-4'>
            <div className="text-sm text-gray-600">
              <div className='flex items-center gap-2'>

                {vehicle.primaryColour === "White" ?
                  <div className="bg-black p-1 rounded-lg">
                    <FaMotorcycle color={vehicle.primaryColour || 'black'} size={24} />
                  </div>
                  :
                  <div className="bg-white p-1 rounded-lg">
                    <FaMotorcycle color={vehicle.primaryColour || 'black'} size={24} />
                  </div>}

                <p className='font-semibold'>
                  {vehicle.make}
                </p>
                <p className="text-sm text-gray-600">{vehicle.model}</p>
                <p className="text-sm text-gray-600">{vehicle.manufacturedate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden fields */}
      <input type="hidden" name="plate" value={vehicle.registration} />
      <input type="hidden" name="make" value={vehicle.make} />
      <input type="hidden" name="model" value={vehicle.model} />
      <input type="hidden" name="series" value={vehicle.series} />
      <input type="hidden" name="type" value={vehicle.type} />
      <input type="hidden" name="year_of_manufacture" value={vehicle.manufactureDate} />
      <input type="hidden" name="year_registration" value={vehicle.year_registration} />
      <input type="hidden" name="engineSize" value={vehicle.engineSize || ''} />
      <input type="hidden" name="power" value={vehicle.power || ''} />
      <input type="hidden" name="transmission" value={vehicle.transmission || ''} />
      <input type="hidden" name="fuel_type" value={vehicle.fuelType || ''} />
      <input type="hidden" name="color" value={vehicle.primaryColour|| ''} />
      <input type="hidden" name="vin" value={vehicle.vin} />
      <input type="hidden" name="engine_number" value={vehicle.engine_number} />
      <input type="hidden" name="maintenance_status" value={''} />

      {/* Editable Fields */}
      <TextInput
        id="mileage"
        name="mileage"
        label="Mileage" 
        type="number"
        placeholder="Enter mileage"
        value={String(vehicle.mileage)}
        error={state.errors?.mileage?.[0]}
      />

      <TextInput
        id="purchase_price"
        name="purchase_price"
        label="Purchase Price"
        type="number"
        placeholder="Enter purchase price"
        value={vehicle.purchase_price || ''}
        error={state.errors?.purchase_price?.[0]}
      />
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

      {/* Status */}
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

      {/* Document Status */}
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

      {/* Insurance Status */}
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

      {/* Company */}
      <div className="mb-4">
        <label htmlFor="company_id" className="mb-2 block text-sm font-medium">
          Company's Unit
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

      {/* Observations */}
      <TextInput
        id="observations"
        name="observations"
        label="Observations"
        type="text"
        placeholder="Enter observations"
        value={vehicle.observations || ''}
        error={state.errors?.observations?.[0]}
      />

      {/* Tracker */}
      <div className="mb-4 flex gap-2 items-center">
        <label htmlFor="tracker" className="block text-sm font-medium">
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
          value={vehicle.tracker_observation || ''}
          error={state.errors?.tracker_observation?.[0]}
        />
      )}

      {/* Error/Success Message */}
      <div aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className={`mt-2 text-sm ${state.errors ? 'text-red-500' : 'text-green-500'}`}>
            {state.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/inventory/vehicles"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update Vehicle</Button>
      </div>
    </form>
  );
}