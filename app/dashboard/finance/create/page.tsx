import Form from '@/app/ui/employees/create-form';
import Breadcrumbs from '@/app/ui/employees/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Employee',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Employees', href: '/dashboard/employees' },
          {
            label: 'Create Employee',
            href: '/dashboard/employees/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}