import Form from '@/app/ui/companies/edit-form';
import Breadcrumbs from '@/app/ui/companies/breadcrumbs';
import { fetchCompanyById } from '@/app/lib/companies/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Company',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const company = await fetchCompanyById(id);

  if (!company) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Companies', href: '/dashboard/companies' },
          {
            label: 'Edit Company',
            href: `/dashboard/companies/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form company={company} />
    </main>
  );
}