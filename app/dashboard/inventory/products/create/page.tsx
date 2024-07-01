import { fetchCategories } from '@/app/lib/products/data'; // Supondo que você tenha uma função para buscar categorias de produtos
import ProductForm from '@/app/ui/products/create-form';
import Breadcrumbs from '@/app/ui/products/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Product',
};

export default async function Page() {
  const categories = await fetchCategories();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          {
            label: 'Create Product',
            href: '/dashboard/inventory/products/create',
            active: true,
          },
        ]}
      />
      <ProductForm categories={categories} />
    </main>
  );
}