'use client';

import { CustomerField, Vehicle } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateVehicle } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import VehicleCard from '@/app/ui/motos/vehicle-card';

interface FormProps {
  vehicle: Vehicle;
  customers: CustomerField[];
}

export default function EditForm({ vehicle, customers }: FormProps) {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(updateVehicle, initialState);
  const [mileage, setMileage] = useState(vehicle.mileage);
  const [status, setStatus] = useState(vehicle.status);
  const [companyId, setCompanyId] = useState(vehicle.company_id || '');
  const [observations, setObservations] = useState(vehicle.observations || '');
  const [tracker, setTracker] = useState(vehicle.tracker || false);
  const [trackerObservation, setTrackerObservation] = useState(vehicle.tracker_observation || '');

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMileage(Number(e.target.value));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  const handleCompanyIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompanyId(e.target.value);
  };

  const handleObservationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservations(e.target.value);
  };

  const handleTrackerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTracker(e.target.checked);
  };

  const handleTrackerObservationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackerObservation(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(new FormData(e.target as HTMLFormElement));
  };

  return (
    <form onSubmit={handleSubmit}>
      <VehicleCard vehicle={vehicle} />

      {/* Editable Fields */}
      <div className="mb-4">
        <label htmlFor="mileage" className="mb-2 block text-sm font-medium">
          Mileage
        </label>
        <input
          id="mileage"
          name="mileage"
          type="number"
          value={mileage}
          onChange={handleMileageChange}
          placeholder="Enter mileage"
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

      <div className="mb-4">
        <label htmlFor="status" className="mb-2 block text-sm font-medium">
          Status
        </label>
        <input
          id="status"
          name="status"
          type="text"
          value={status}
          onChange={handleStatusChange}
          placeholder="Enter status"
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

      <div className="mb-4">
        <label htmlFor="observations" className="mb-2 block text-sm font-medium">
          Observations
        </label>
        <textarea
          id="observations"
          name="observations"
          value={observations}
          onChange={handleObservationsChange}
          placeholder="Enter observations"
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

      <div className="mb-4">
        <label htmlFor="tracker" className="mb-2 block text-sm font-medium">
          Tracker
        </label>
        <input
          id="tracker"
          name="tracker"
          type="checkbox"
          checked={tracker}
          onChange={handleTrackerChange}
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
        <div className="mb-4">
          <label htmlFor="tracker_observation" className="mb-2 block text-sm font-medium">
            Tracker Observation
          </label>
          <input
            id="tracker_observation"
            name="tracker_observation"
            type="text"
            value={trackerObservation}
            onChange={handleTrackerObservationChange}
            placeholder="Enter Tracker Observation"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="tracker_observation-error"
          />
          <div id="tracker_observation-error" aria-live="polite" aria-atomic="true">
            {state.errors?.tracker_observation &&
              state.errors.tracker_observation.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      )}

      <div aria-live="polite" aria-atomic="true">
        {state.message ? (
          <p className="mt-2 text-sm text-green-500">{state.message}</p>
        ) : null}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/vehicles"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update Vehicle</Button>
      </div>
    </form>
  );
}