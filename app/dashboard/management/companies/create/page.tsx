import Form from '@/app/ui/companies/create-form';
import Breadcrumbs from '@/app/ui/companies/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Company',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Companies', href: '/dashboard/companies' },
          {
            label: 'Create Company',
            href: '/dashboard/companies/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}