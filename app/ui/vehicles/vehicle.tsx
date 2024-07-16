'use client'

import React, { useState } from 'react';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils'; // Assume que existe uma função de formatação de data
import { VehicleProps } from '@/app/lib/vehicles/definitions';
import { DeleteVehicle, UpdateVehicle } from './buttons';

const Vehicle: React.FC<VehicleProps> = ({ vehicleData, vehicle }) => {
  const [openTestIndex, setOpenTestIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenTestIndex(openTestIndex === index ? null : index);
  };

  const getMOTStatus = () => {
    const latestTest = vehicleData.motTests[0]; // Assume o primeiro item é o mais recente
    if (!latestTest || !latestTest.expiryDate) return 'No Data';
    const expiryDate = new Date(latestTest.expiryDate);
    const now = new Date();
    return expiryDate >= now ? 'Valid' : 'Expired';
  };

  const motStatus = getMOTStatus();
  const motStatusClass = motStatus === 'Valid' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <div>
            <p className="rounded-xl bg-gray-100 text-xs text-gray-900 p-1 text-center">Status: {vehicle.status}</p>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">MOT <span className={`text-sm font-medium ${motStatusClass}`}>{motStatus}</span></p>
        </div>
        <div className="flex justify-center gap-2">
          <UpdateVehicle id={vehicle.id} />
          <DeleteVehicle id={vehicle.id} />
        </div>
      </div>
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Purchase Price</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(Number(vehicle.purchase_price))}</dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Sale Price</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(Number(vehicle.sale_price))}</dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Rental Price</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(Number(vehicle.rental_price))}</dd>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Mileage</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{vehicle.mileage}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Make</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{vehicleData.make}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Model</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{vehicleData.model}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">First Used Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDateToLocal(vehicleData.firstUsedDate)}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Fuel Type</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{vehicleData.fuelType}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Primary Colour</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{vehicleData.primaryColour}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Engine Size</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{vehicleData.engineSize}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Outstanding Recall</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{vehicleData.hasOutstandingRecall}</dd>
          </div>
          {vehicle.tracker && 
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Tracker</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{vehicle.tracker_observation}</dd>
          </div>}
        </dl>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">MOT History</h3>
      </div>
      <div className="border-t border-gray-200 max-h-96 overflow-y-auto">
        {vehicleData.motTests.map((test, index) => (
          <div key={test.motTestNumber} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
            <button
              className="w-full text-left px-4 py-5 sm:px-6 text-sm font-medium text-gray-900 focus:outline-none"
              onClick={() => toggleOpen(index)}
            >
              <div className="flex justify-between items-center">
                <span>Test Date: {formatDateToLocal(test.completedDate)}</span>
                <span>{openTestIndex === index ? '-' : '+'}</span>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Result: {test.testResult} | Mileage: {test.odometerValue} {test.odometerUnit}
              </p>
              {test.expiryDate && (
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Expiry Date: {formatDateToLocal(test.expiryDate)}
                </p>
              )}
            </button>
            {openTestIndex === index && (
              <div className="px-4 py-5 sm:px-6 text-sm text-gray-500">
                {test.defects.length > 0 ? (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium text-gray-700">Defects:</h5>
                    <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                      {test.defects.map((defect, defectIndex) => (
                        <li key={defectIndex}>
                          {defect.text} ({defect.type})
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No defects found.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehicle;
