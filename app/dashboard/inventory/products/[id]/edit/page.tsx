import ProductEditForm from '@/app/ui/products/edit-form';
import Breadcrumbs from '@/app/ui/products/breadcrumbs';
import { fetchProductById, fetchCategories } from '@/app/lib/products/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Product',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [product, categories] = await Promise.all([
    fetchProductById(id),
    fetchCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          {
            label: 'Edit Product',
            href: `/dashboard/products/${id}/edit`,
            active: true,
          },
        ]}
      />
      <ProductEditForm product={product} categories={categories} />
    </main>
  );
}