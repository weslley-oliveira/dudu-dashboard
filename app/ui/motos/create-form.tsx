'use client';

import { CustomerField, Vehicle } from '@/app/lib/vehicles/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createVehicle } from '@/app/lib/vehicles/actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import { fetchVehicleData } from '@/app/lib/vehicles/data';
import VehicleCard from '@/app/ui/motos/vehicle-card';
import TextInput from '@/app/ui/motos/form/TextInput';

export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(createVehicle, initialState);
  const [plate, setPlate] = useState('');
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);
  const [tracker, setTracker] = useState(false);
  const [trackerObservation, setTrackerObservation] = useState('');
  const [status, setStatus] = useState('Available');

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
          <button type="button" onClick={handleFetchData} className="bg-blue-600 text-white rounded-lg p-2">
            Buscar
          </button>
        </div>
      </div>

      {vehicleData && <VehicleCard vehicle={vehicleData} />}

      {vehicleData && (
        <>
          {/* Hidden fields to pass vehicle data for validation */}
          <input type="hidden" name="plate" value={vehicleData.plate} />
          <input type="hidden" name="make" value={vehicleData.make} />
          <input type="hidden" name="model" value={vehicleData.model} />
          <input type="hidden" name="series" value={vehicleData.series} />
          <input type="hidden" name="type" value={vehicleData.type} />
          <input type="hidden" name="year_of_manufacture" value={vehicleData.year_of_manufacture} />
          <input type="hidden" name="year_registration" value={vehicleData.year_registration} />
          <input type="hidden" name="engine_capacity" value={vehicleData.specs.engine_capacity} />
          <input type="hidden" name="power" value={vehicleData.specs.power} />
          <input type="hidden" name="transmission" value={vehicleData.specs.transmission} />
          <input type="hidden" name="fuel_type" value={vehicleData.specs.fuel_type} />
          <input type="hidden" name="color" value={vehicleData.specs.color} />
          <input type="hidden" name="vin" value={vehicleData.vin} />
          <input type="hidden" name="engine_number" value={vehicleData.engine_number} />
          <input type="hidden" name="sale_price" value={vehicleData.price.sale_price} />
          <input type="hidden" name="rental_price" value={vehicleData.price.rental_price} />
          <input type="hidden" name="document_status" value={vehicleData.document_status} />
          <input type="hidden" name="insurance_status" value={vehicleData.insurance_status} />
          <input type="hidden" name="maintenance_status" value={vehicleData.maintenance_status} />
          <input type="hidden" name="mot" value={vehicleData.mot} />
          <input type="hidden" name="tracker_observation" value={vehicleData.tracker_observation} />

          {/* Editable Fields */}
          <TextInput
            id="mileage"
            name="mileage"
            label="Mileage"
            type="number"
            placeholder="Enter mileage"
            value={String(vehicleData.specs.mileage)}
            error={state.errors?.mileage?.[0]}
          />

          <div className='flex gap-2'>

          <TextInput
            id="sale_price"
            name="sale_price"
            label="Sale Price"
            type="number"
            placeholder="Enter sale price"
            value={String(vehicleData.price.sale_price)}
            error={state.errors?.sale_price?.[0]}
          />

          <TextInput
            id="rental_price"
            name="rental_price"
            label="Rental Price"
            type="number"
            placeholder="Enter rental price"
            value={String(vehicleData.price.rental_price)}
            error={state.errors?.rental_price?.[0]}
          />
          </div>

          <TextInput
            id="mot"
            name="mot"
            label="MOT"
            type="text"
            placeholder="Enter MOT number"
            value={vehicleData.mot}
            error={state.errors?.mot?.[0]}
          />

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
            placeholder="Enter observations"
            value={vehicleData.observations}
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
