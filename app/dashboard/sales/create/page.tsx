import { fetchCustomers } from '@/app/lib/customers/data';
import { fetchVehicles } from '@/app/lib/vehicles/data';
import { fetchParts } from '@/app/lib/parts/data';
import Form from '@/app/ui/sales/create-form';
import Breadcrumbs from '@/app/ui/sales/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Sale',
};

export default async function Page() {
  const customers = await fetchCustomers();
  const vehicles = await fetchVehicles();
  const parts = await fetchParts();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Sales', href: '/dashboard/sales' },
          {
            label: 'Create Sale',
            href: '/dashboard/sales/create',
            active: true,
          },
        ]} 
      />
      <Form customers={customers} vehicles={vehicles} parts={parts} />
    </main>
  );
}
