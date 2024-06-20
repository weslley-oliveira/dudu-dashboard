import EditCustomerForm from '@/app/ui/customers/EditCustomerForm';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import { fetchCustomerById } from '@/app/lib/customers/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Customer',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const customer = await fetchCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Edit Customer',
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditCustomerForm customer={customer} />
    </main>
  );
}