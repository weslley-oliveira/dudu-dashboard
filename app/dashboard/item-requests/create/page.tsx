import Form from '@/app/ui/item-requests/create-form';
import Breadcrumbs from '@/app/ui/item-requests/breadcrumbs';
import { fetchProducts } from '@/app/lib/products/data';
import { fetchParts } from '@/app/lib/parts/data';
import { Metadata } from 'next';
import PartsTable from '@/app/ui/item-requests/part-list';
import Search from '@/app/ui/search';

export const metadata: Metadata = {
  title: 'Create Item Request',
};

export default async function Page(
  {
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    };
  }
) {
  const [parts, products] = await Promise.all([fetchParts(), fetchProducts()]);

  const queries = searchParams?.query || 'null';

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Item Requests', href: '/dashboard/item-requests' },
          {
            label: 'Create Item Request',
            href: '/dashboard/item-requests/create',
            active: true,
          },
        ]}
      />
      {/* Item Name */}
      <PartsTable/>
      {/* <Form parts={parts} products={products} query={queries}/> */}
    </main>
  );
}