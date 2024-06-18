'use client';

import { CustomerField, Vehicle } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createVehicle } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import { toUpperCase } from '@/app/lib/utils';

export const fetchVehicleData = async (plate: string): Promise<Vehicle> => {
  const apiKey = '06a0f54d-44ea-404b-8978-7f519f4f4534';
  const url = `https://uk1.ukvehicledata.co.uk/api/datapackage/VehicleAndMotHistory?v=2&api_nullitems=1&auth_apikey=${apiKey}&key_VRM=${plate}`;
  const response = await fetch(url);
  const data = await response.json();

  return {
    vrn: data.Request.DataKeys.Vrm,
    make: data.Response.DataItems.VehicleRegistration.Make,
    modelvariant: data.Response.DataItems.SmmtDetails.ModelVariant,
    // SysSetupDate: data.Response.DataItems.SmmtDetails.SysSetupDate,
    series: data.Response.DataItems.SmmtDetails.Series,
    enginecapacity: data.Response.DataItems.VehicleRegistration.EngineCapacity,
    vin: data.Response.DataItems.VehicleRegistration.Vin,
    yearofmanufacture: parseInt(data.Response.DataItems.VehicleRegistration.YearOfManufacture),
    enginenumber: data.Response.DataItems.VehicleRegistration.EngineNumber,
    fueltype: data.Response.DataItems.VehicleRegistration.FuelType
  };
};

export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useFormState(createVehicle, initialState);
  const [plate, setPlate] = useState('');
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);

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

  console.log("AAAs", vehicleData)
  return (
    <form action={dispatch}>

      {/* {PLACA Search} */}
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
              value={plate} onChange={handlePlateChange}
              className="peer uppercase block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="mileage-error"
            />
          <button type="button" onClick={handleFetchData} className='bg-blue-600 text-white rounded-lg p-2'>Buscar</button>
          </div>

        </div>

      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* VRN */}
        <div className="mb-4">
          <label htmlFor="vrn" className="mb-2 block text-sm font-medium">
            Vehicle Registration Number (VRN)
          </label>
          <div className="relative">
            <input
              id="vrn"
              name="vrn"
              type="text"
              defaultValue={toUpperCase(vehicleData?.vrn)}
              placeholder="Enter VRN"
              className="peer uppercase block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="vrn-error"
            />
          </div>

          <div id="vrn-error" aria-live="polite" aria-atomic="true">
            {state.errors?.vrn &&
              state.errors.vrn.map((error: string) => (
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
          <div className="relative">
            <input
              id="make"
              name="make"
              type="text"
              defaultValue={vehicleData?.make}
              placeholder="Enter make"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="make-error"
            />
          </div>

          <div id="make-error" aria-live="polite" aria-atomic="true">
            {state.errors?.make &&
              state.errors.make.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Series */}
        <div className="mb-4">
          <label htmlFor="Series" className="mb-2 block text-sm font-medium">
            Series
          </label>
          <div className="relative">
            <input
              id="Series"
              name="Series"
              type="text"
              defaultValue={vehicleData?.series}
              placeholder="Enter series"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="series-error"
            />
          </div>

          <div id="series-error" aria-live="polite" aria-atomic="true">
            {state.errors?.Series &&
              state.errors.Series.map((error: string) => (
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
          <div className="relative">
            <input
              id="mileage"
              name="mileage"
              type="number"
              placeholder="Enter mileage"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="mileage-error"
            />
          </div>

          <div id="mileage-error" aria-live="polite" aria-atomic="true">
            {state.errors?.mileage &&
              state.errors.mileage.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Observacoes */}
        <div className="mb-4">
          <label htmlFor="observacoes" className="mb-2 block text-sm font-medium">
            Observations
          </label>
          <div className="relative">
            <textarea
              id="observacoes"
              name="observacoes"
              placeholder="Enter observations"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="observacoes-error"
            />
          </div>

          <div id="observacoes-error" aria-live="polite" aria-atomic="true">
            {state.errors?.observacoes &&
              state.errors.observacoes.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Model Variant */}
        <div className="mb-4">
          <label htmlFor="modelvariant" className="mb-2 block text-sm font-medium">
            Model Variant
          </label>
          <div className="relative">
            <input
              id="modelvariant"
              name="modelvariant"
              type="text"
              defaultValue={vehicleData?.modelvariant}
              placeholder="Enter model variant"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="modelvariant-error"
            />
          </div>

          <div id="modelvariant-error" aria-live="polite" aria-atomic="true">
            {state.errors?.modelvariant &&
              state.errors.modelvariant.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Engine Capacity */}
        <div className="mb-4">
          <label htmlFor="EngineCapacity" className="mb-2 block text-sm font-medium">
            Engine Capacity
          </label>
          <div className="relative">
            <input
              id="EngineCapacity"
              name="EngineCapacity"
              type="text"
              defaultValue={vehicleData?.enginecapacity}

              placeholder="Enter engine capacity"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="engine-capacity-error"
            />
          </div>

          <div id="engine-capacity-error" aria-live="polite" aria-atomic="true">
            {state.errors?.EngineCapacity &&
              state.errors.EngineCapacity.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* VIN */}
        <div className="mb-4">
          <label htmlFor="Vin" className="mb-2 block text-sm font-medium">
            Vehicle Identification Number (VIN)
          </label>
          <div className="relative">
            <input
              id="Vin"
              name="Vin"
              type="text"
              defaultValue={vehicleData?.vin}
              placeholder="Enter VIN"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="vin-error"
            />
          </div>

          <div id="vin-error" aria-live="polite" aria-atomic="true">
            {state.errors?.Vin &&
              state.errors.Vin.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Engine Number */}
        <div className="mb-4">
          <label htmlFor="EngineNumber" className="mb-2 block text-sm font-medium">
            Engine Number
          </label>
          <div className="relative">
            <input
              id="EngineNumber"
              name="EngineNumber"
              type="text"
              defaultValue={vehicleData?.enginenumber}
              placeholder="Enter engine number"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="engine-number-error"
            />
          </div>

          <div id="engine-number-error" aria-live="polite" aria-atomic="true">
            {state.errors?.EngineNumber &&
              state.errors.EngineNumber.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Fuel Type */}
        <div className="mb-4">
          <label htmlFor="FuelType" className="mb-2 block text-sm font-medium">
            Fuel Type
          </label>
          <div className="relative">
            <input
              id="FuelType"
              name="FuelType"
              type="text"
              defaultValue={vehicleData?.fueltype}
              

              placeholder="Enter fuel type"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="fuel-type-error"
            />
          </div>

          <div id="fuel-type-error" aria-live="polite" aria-atomic="true">
            {state.errors?.FuelType &&
              state.errors.FuelType.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the vehicle status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="rented"
                  name="status"
                  type="radio"
                  value="rented"
                  className="text-white-600 h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 focus:ring-2"
                />
                <label
                  htmlFor="rented"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  rented
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="to-rent"
                  name="status"
                  type="radio"
                  value="to rent"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="to-rent"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  To Rent
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="sold"
                  name="status"
                  type="radio"
                  value="sold"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="sold"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-yellow-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Sold 
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="to-sell"
                  name="status"
                  type="radio"
                  value="to-sell"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="sold"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  To Sell
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>


        {/* Company ID */}
        <div className="mb-4">
          <label htmlFor="company_id" className="mb-2 block text-sm font-medium">
            Company ID
          </label>
          <div className="relative">
            <input
              id="company_id"
              name="company_id"
              type="number"
              placeholder="Enter company ID"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="company-id-error"
            />
          </div>

          <div id="company-id-error" aria-live="polite" aria-atomic="true">
            {state.errors?.company_id &&
              state.errors.company_id.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Year of Manufacture */}
        <div className="mb-4">
          <label htmlFor="YearOfManufacture" className="mb-2 block text-sm font-medium">
            Year of Manufacture
          </label>
          <div className="relative">
            <input
              id="YearOfManufacture"
              name="YearOfManufacture"
              type="number"
              defaultValue={vehicleData?.yearofmanufacture}
              placeholder="Enter year of manufacture"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="year-of-manufacture-error"
            />
          </div>

          <div id="year-of-manufacture-error" aria-live="polite" aria-atomic="true">
            {state.errors?.YearOfManufacture &&
              state.errors.YearOfManufacture.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-green-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/vehicles"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Vehicle</Button>
      </div>
    </form>
  );
}
