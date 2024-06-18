'use client';

import { CustomerField, Vehicle } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateVehicle } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
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
  const plate = vehicle.vrn;
  if (!plate) {
    throw new Error('Placa do veículo não definida.');
  }
  const initialState: State = { message: '', errors: {} };
  const updateInvoiceWithId = async (prevState: State, formData: FormData) => updateVehicle(plate, prevState, formData);
  const [state, dispatch] = useFormState(updateInvoiceWithId, initialState);

  console.log('HOJE', vehicle)
  return (
    <form action={dispatch}>
      {vehicle && (
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <div className="mb-4">
            <label htmlFor="vrn" className="mb-2 block text-sm font-medium">
              Vehicle Registration Number (VRN)
            </label>
            <div className="relative">
              <input
                id="vrn"
                name="vrn"
                type="text"
                defaultValue={vehicle.vrn || ''}
                placeholder="Enter VRN"
                className="peer uppercase block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="vrn-error"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="make" className="mb-2 block text-sm font-medium">
              Make
            </label>
            <div className="relative">
              <input
                id="make"
                name="make"
                type="text"
                defaultValue={vehicle.make || ''}
                placeholder="Enter make"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="make-error"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="te" className="mb-2 block text-sm font-medium">
              TE
            </label>
            <div className="relative">
              <input
                id="te"
                name="te"
                type="text"
                defaultValue={vehicle.te || ''}
                placeholder="Enter TE"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="te-error"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="series" className="mb-2 block text-sm font-medium">
              Series
            </label>
            <div className="relative">
              <input
                id="series"
                name="series"
                type="text"
                defaultValue={vehicle.series || ''}
                placeholder="Enter series"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="series-error"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="mileage" className="mb-2 block text-sm font-medium">
              Mileage
            </label>
            <div className="relative">
              <input
                id="mileage"
                name="mileage"
                type="number"
                defaultValue={vehicle.mileage || 0}
                placeholder="Enter mileage"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="mileage-error"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="observacoes" className="mb-2 block text-sm font-medium">
              Observations
            </label>
            <div className="relative">
              <textarea
                id="observacoes"
                name="observacoes"
                defaultValue={vehicle.observacoes || ''}
                placeholder="Enter observations"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="observacoes-error"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="modelvariant" className="mb-2 block text-sm font-medium">
              Model Variant
            </label>
            <div className="relative">
              <input
                id="modelvariant"
                name="modelvariant"
                type="text"
                defaultValue={vehicle.modelvariant || ''}
                placeholder="Enter model variant"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="modelvariant-error"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="enginecapacity" className="mb-2 block text-sm font-medium">
              Engine Capacity
            </label>
            <div className="relative">
              <input
                id="enginecapacity"
                name="enginecapacity"
                type="text"
                defaultValue={vehicle.enginecapacity || ''}
                placeholder="Enter engine capacity"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="enginecapacity-error"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="syssetupdate" className="mb-2 block text-sm font-medium">
              Sys Setup Date
            </label>
            <div className="relative">
              <input
                id="syssetupdate"
                name="syssetupdate"
                type="date"
                defaultValue={vehicle.syssetupdate ? new Date(vehicle.syssetupdate).toISOString().split('T')[0] : ''}
                placeholder="Enter sys setup date"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="syssetupdate-error"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="vin" className="mb-2 block text-sm font-medium">
              Vehicle Identification Number (VIN)
            </label>
            <div className="relative">
              <input
                id="vin"
                name="vin"
                type="text"
                defaultValue={vehicle.vin || ''}
                placeholder="Enter VIN"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="vin-error"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="enginenumber" className="mb-2 block text-sm font-medium">
              Engine Number
            </label>
            <div className="relative">
              <input
                id="enginenumber"
                name="enginenumber"
                type="text"
                defaultValue={vehicle.enginenumber || ''}
                placeholder="Enter engine number"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="enginenumber-error"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="fueltype" className="mb-2 block text-sm font-medium">
              Fuel Type
            </label>
            <div className="relative">
              <input
                id="fueltype"
                name="fueltype"
                type="text"
                defaultValue={vehicle.fueltype || ''}
                placeholder="Enter fuel type"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="fueltype-error"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="mb-2 block text-sm font-medium">
              Status
            </label>
            <div className="relative">
              <input
                id="status"
                name="status"
                type="text"
                defaultValue={vehicle.status || ''}
                placeholder="Enter status"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="status-error"
              />
            </div>
          </div>


          <div className="mb-4">
            <label htmlFor="company_id" className="mb-2 block text-sm font-medium">
              Company ID
            </label>
            <div className="relative">
              <input
                id="company_id"
                name="company_id"
                type="number"
                defaultValue={vehicle.company_id || 0}
                placeholder="Enter company ID"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="company-id-error"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="yearofmanufacture" className="mb-2 block text-sm font-medium">
              Year of Manufacture
            </label>
            <div className="relative">
              <input
                id="yearofmanufacture"
                name="yearofmanufacture"
                type="number"
                defaultValue={vehicle.yearofmanufacture || 0}
                placeholder="Enter year of manufacture"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="yearofmanufacture-error"
              />
            </div>
          </div>

          <div aria-live="polite" aria-atomic="true">
            {state.message ? (
              <p className="mt-2 text-sm text-green-500">{state.message}</p>
            ) : null}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/vehicles"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <button type="submit" className="bg-blue-600 text-white rounded-lg p-2">Update Vehicle</button>
      </div>
    </form>
  );
}