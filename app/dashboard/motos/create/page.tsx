import { fetchCustomers } from '@/app/lib/data';
import Form from '@/app/ui/motos/create-form';
import Breadcrumbs from '@/app/ui/motos/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Vehicle',
};

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Vehicles', href: '/dashboard/motos' },
          {
            label: 'Create Vehicle',
            href: '/dashboard/motos/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}