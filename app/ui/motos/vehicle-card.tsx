'use client';
import { Vehicle } from '@/app/lib/definitions';
import { useState } from 'react';
import { FaMotorcycle, FaCarSide } from 'react-icons/fa';
import UkLicensePlate from '../UkLicensePlate';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="py-4">
      <div className="flex justify-between items-center">
        <div className='flex gap-2 items-center'>
          <UkLicensePlate plateNumber={`${vehicle.plate}`} />
          <div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <div className="bg-gray-200 p-1 rounded-lg">
              {vehicle.type === 'Car' ? <FaCarSide size={24} color={vehicle.color}/> : <FaMotorcycle size={24} />}
                </div>{vehicle.make} </p>
            <p className="text-sm text-gray-600">{vehicle.model}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">{vehicle.color}</p>
            <p className="text-sm text-gray-600">{vehicle.year_of_manufacture}</p>
          </div>
          <div className="ml-2">
            
          </div>
        </div>
        <button
          onClick={handleToggleDetails}
          className="bg-blue-600 text-white rounded-lg p-2 ml-4"
        >
          {showDetails ? 'Hide Features' : 'View All Features'}
        </button>
      </div>
      {showDetails && (
        <div className="mt-4">
          <p><strong>Series:</strong> {vehicle.series}</p>
          <p><strong>VIN:</strong> {vehicle.vin}</p>
          <p><strong>Engine Number:</strong> {vehicle.engine_number}</p>
          <p><strong>Engine Capacity:</strong> {vehicle.engine_capacity}</p>
          <p><strong>Fuel Type:</strong> {vehicle.fuel_type}</p>
        </div>
      )}
    </div>
  );
}
