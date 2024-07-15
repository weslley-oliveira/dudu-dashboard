'use client';

import { Vehicle } from '@/app/lib/vehicles/definitions';
import { useState } from 'react';
import { FaMotorcycle, FaCarSide } from 'react-icons/fa';
import UkLicensePlate from '../UkLicensePlate';
import { checkExpiryDate, getYearFromDate } from '@/app/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const motStatus = checkExpiryDate(String(vehicle.motTests[0].expiryDate));
  const statusClass = motStatus === 'expired' ? 'text-red-500' : 'text-green-500';

  console.log('estou dernto do negocio', vehicle)
  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
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
              <p className="text-sm text-gray-600">{getYearFromDate(vehicle.manufactureDate)}</p>
            </div>
            <div className='pt-2 flex items-center justify-between'>
              <p><strong>MOT Expiry Date</strong></p>
              <p>{vehicle.motTests[0].expiryDate}</p>
              <p className={statusClass}>{motStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
