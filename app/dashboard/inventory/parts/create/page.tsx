import { fetchCompanies } from '@/app/lib/companies/data';
import Form from '@/app/ui/parts/create-form';
import Breadcrumbs from '@/app/ui/parts/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Part',
};

export default async function Page() {
  const companies = await fetchCompanies();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Parts', href: '/dashboard/parts' },
          {
            label: 'Create Part',
            href: '/dashboard/inventory/parts/create',
            active: true,
          },
        ]}
      />
      <Form companies={companies} />
    </main>
  );
}