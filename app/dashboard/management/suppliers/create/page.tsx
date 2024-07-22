import Form from '@/app/ui/suppliers/create-form';
import Breadcrumbs from '@/app/ui/suppliers/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Supplier',
};

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Suppliers', href: '/dashboard/management/suppliers' },
          {
            label: 'Create Supplier',
            href: '/dashboard/management/suppliers/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}