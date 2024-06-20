// app/ui/UkLicensePlate.tsx
import React from 'react';

interface UkLicensePlateProps {
  plateNumber: string;
}

const formatUKNumberPlate = (numberPlate: string): string => {
  const cleanedPlate = numberPlate.replace(/\s+/g, '').toUpperCase();
  return cleanedPlate.slice(0, 4) + ' ' + cleanedPlate.slice(4);
};

const UkLicensePlate: React.FC<UkLicensePlateProps> = ({ plateNumber }) => {
  const formattedPlate = formatUKNumberPlate(plateNumber);

  return (
    <div className="flex justify-center items-center p-4 bg-yellow-400 border border-black rounded-lg w-72 h-20">
      <div className="text-black font-bold text-4xl tracking-widest">
        {formattedPlate}
      </div>
    </div>
  );
};

export default UkLicensePlate;