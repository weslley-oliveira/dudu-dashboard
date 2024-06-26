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
          { label: 'Suppliers', href: '/dashboard/suppliers' },
          {
            label: 'Create Supplier',
            href: '/dashboard/suppliers/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}