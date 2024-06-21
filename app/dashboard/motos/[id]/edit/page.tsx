import Form from '@/app/ui/motos/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchVehicleById } from '@/app/lib/vehicles/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchCompanies } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Edit Vehicle', 
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [vehicle, customers] = await Promise.all([
    fetchVehicleById(id),
    fetchCompanies()
  ]);

  if (!vehicle) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Vehicles', href: '/dashboard/motos' },
          {
            label: 'Edit Vehicle',
            href: `/dashboard/motos/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form vehicle={vehicle} customers={customers} />
    </main>
  );
}
