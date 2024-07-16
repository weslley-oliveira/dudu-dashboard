import Vehicle from '@/app/ui/vehicles/vehicle';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchVehicleById, fetchVehicleDataToSee } from '@/app/lib/vehicles/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vehicle', 
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const vehicle = await fetchVehicleById(id);

  // Check if the vehicle was found
  if (!vehicle) {
    notFound();
    return;
  }

  // Fetch vehicle data using the registration property
  const vehicleData = await fetchVehicleDataToSee(vehicle.registration)

  // if (!vehicle) {
  //   notFound();
  // }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Vehicles', href: '/dashboard/inventory/vehicles' },
          {
            label: `${vehicle.make} ${vehicle.model} ${vehicle.manufacturedate}`,
            href: `/dashboard/inventory/vehicles/${id}`,
            active: true,
          },
        ]}
      />
      <Vehicle vehicleData={vehicleData} vehicle={vehicle}/>
    </main>
  );
}
