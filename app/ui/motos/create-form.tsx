'use client';

import { CustomerField, Vehicle } from '@/app/lib/vehicles/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createVehicle } from '@/app/lib/vehicles/actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import { fetchVehicleData } from '@/app/lib/data';
import VehicleCard from '@/app/ui/motos/vehicle-card';

export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(createVehicle, initialState);
  const [plate, setPlate] = useState('');
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);
  const [tracker, setTracker] = useState(false);
  const [trackerObservation, setTrackerObservation] = useState('');

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(e.target.value);
  };

  const handleFetchData = async () => {
    try {
      const data = await fetchVehicleData(plate);
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

  return (
    <form action={dispatch} onKeyDown={handleKeyDown}>
      {/* Plate Search */}
      <div className="mb-4">
        <label htmlFor="plate" className="mb-2 block text-sm font-medium">
          Placa do Veículo:
        </label>
        <div className="relative flex gap-4">
          <input
            id="plate"
            name="plate"
            type="text"
            placeholder="Enter Plate"
            value={plate}
            onChange={handlePlateChange}
            className="peer uppercase block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="plate-error"
          />
          <button type="button" onClick={handleFetchData} className='bg-blue-600 text-white rounded-lg p-2'>
            Buscar
          </button>
        </div>
      </div>

      {vehicleData && (
        <VehicleCard vehicle={vehicleData} />
      )}

      {vehicleData && (
        <>
          {/* Hidden fields to pass vehicle data for validation */}
          <input type="hidden" name="plate" value={vehicleData.plate} />
          <input type="hidden" name="make" value={vehicleData.make} />
          <input type="hidden" name="type" value={vehicleData.type} />
          <input type="hidden" name="series" value={vehicleData.series} />
          <input type="hidden" name="model" value={vehicleData.model} />
          <input type="hidden" name="engine_capacity" value={vehicleData.engine_capacity} />
          <input type="hidden" name="vin" value={vehicleData.vin} />
          <input type="hidden" name="engine_number" value={vehicleData.engine_number} />
          <input type="hidden" name="fuel_type" value={vehicleData.fuel_type} />
          <input type="hidden" name="year_of_manufacture" value={vehicleData.year_of_manufacture} />
          <input type="hidden" name="color" value={vehicleData.color} />

          {/* Editable Fields */}
          {/* Mileage */}
          <div className="mb-4">
            <label htmlFor="mileage" className="mb-2 block text-sm font-medium">
              Mileage
            </label>
            <input
              id="mileage"
              name="mileage"
              type="number"
              defaultValue={vehicleData.mileage}
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
          {/* MOT */}
          <div className="mb-4">
            <label htmlFor="mot" className="mb-2 block text-sm font-medium">
              MOT
            </label>
            <input
              id="mot"
              name="mot"
              type="text"
              defaultValue={vehicleData.mot}
              placeholder="Enter MOT number"
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
            <input
              id="status"
              name="status"
              type="text"
              defaultValue={vehicleData.status}
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

          {/* Company ID */}
          <div className="mb-4">
            <label htmlFor="company_id" className="mb-2 block text-sm font-medium">
              Company
            </label>
            <select
              id="company_id"
              name="company_id"
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
              defaultValue={vehicleData.observations}
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

          {/* Tracker */}
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
            <div className="mb-4">
              <label htmlFor="tracker_observation" className="mb-2 block text-sm font-medium">
                Tracker Observation
              </label>
              <input
                id="tracker_observation"
                name="tracker_observation"
                type="text"
                defaultValue={trackerObservation}
                onChange={(e) => setTrackerObservation(e.target.value)}
                placeholder="Enter Tracker Observation"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="tracker_observation-error"
              />
        
            </div>
          )}

          <div aria-live="polite" aria-atomic="true">
            {state.message ? (
              <p className="mt-2 text-sm text-green-500">{state.message}</p>
            ) : null}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/motos"
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <Button type="submit">Create Vehicle</Button>
          </div>
        </>
      )}
    </form>
  );
}
