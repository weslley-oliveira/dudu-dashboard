import Form from '@/app/ui/item-requests/edit-form';
import Breadcrumbs from '@/app/ui/item-requests/breadcrumbs';
import { fetchItemRequestById } from '@/app/lib/item-requests/data';
import { fetchProducts } from '@/app/lib/products/data';
import { fetchParts } from '@/app/lib/parts/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Item Request',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [itemRequest, parts, products] = await Promise.all([
    fetchItemRequestById(id),
    fetchParts(),
    fetchProducts(),
  ]);

  if (!itemRequest) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Item Requests', href: '/dashboard/item-requests' },
          {
            label: 'Edit Item Request',
            href: `/dashboard/item-requests/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form itemRequest={itemRequest} parts={parts} products={products} />
    </main>
  );
}