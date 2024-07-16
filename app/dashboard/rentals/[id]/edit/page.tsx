import Form from '@/app/ui/rentals/edit-form';
import Breadcrumbs from '@/app/ui/rentals/breadcrumbs';
import { fetchRentalById } from '@/app/lib/rentals/data';
import { fetchVehicles } from '@/app/lib/vehicles/data';
import { fetchCustomers } from '@/app/lib/customers/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Rental',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const rental = await fetchRentalById(id);

  if (!rental) {
    notFound();
  }

  const customers = await fetchCustomers();
  const vehicles = await fetchVehicles();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Rentals', href: '/dashboard/rentals' },
          {
            label: 'Edit Rental',
            href: `/dashboard/rentals/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form rental={rental} customers={customers} vehicles={vehicles} />
    </main>
  );
}