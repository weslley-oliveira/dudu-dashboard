import { fetchCompanies } from '@/app/lib/companies/data'; // Supondo que você tenha uma função para buscar categorias de produtos
import Form from '@/app/ui/products/create-form';
import Breadcrumbs from '@/app/ui/products/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Product',
};

export default async function Page() {
  const companies = await fetchCompanies();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/inventory/products' },
          {
            label: 'Create Product',
            href: '/dashboard/inventory/products/create',
            active: true,
          },
        ]}
      />
      <Form companies={companies} />
    </main>
  );
}