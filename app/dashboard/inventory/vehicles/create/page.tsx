import { fetchCompanies } from '@/app/lib/data';
import Form from '@/app/ui/vehicles/create-form';
import Breadcrumbs from '@/app/ui/vehicles/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Vehicle',
};

export default async function Page() {
  const companies = await fetchCompanies();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Vehicles', href: '/dashboard/inventory/vehicles' },
          {
            label: 'Create Vehicle',
            href: '/dashboard/inventory/vehicles/create',
            active: true,
          },
        ]}
      />
      <Form companies={companies} />
    </main>
  );
}