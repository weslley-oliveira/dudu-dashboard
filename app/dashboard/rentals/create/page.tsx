import { fetchCustomers } from '@/app/lib/customers/data';
import { fetchVehicles } from '@/app/lib/vehicles/data';
import Form from '@/app/ui/rentals/create-form';
import Breadcrumbs from '@/app/ui/rentals/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Rental',
};

export default async function Page() {
  const customers = await fetchCustomers();
  const vehicles = await fetchVehicles();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Rentals', href: '/dashboard/rentals' },
          {
            label: 'Create Rental',
            href: '/dashboard/rentals/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} vehicles={vehicles} />
    </main>
  );
}