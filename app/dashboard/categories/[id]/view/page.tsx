import Breadcrumbs from '@/app/ui/categories/breadcrumbs';
import { fetchCategoryById } from '@/app/lib/categories/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View Category',
};

export default async function Page({ params }: { params: { id: string } }) {
  const category = await fetchCategoryById(params.id);

  if (!category) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Categories', href: '/dashboard/categories' },
          {
            label: 'View Category',
            href: `/dashboard/categories/${params.id}/view`,
            active: true,
          },
        ]}
      />
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <h1 className="text-2xl font-semibold">{category.category_name}</h1>
        <p className="mt-2 text-sm text-gray-600">{category.description}</p>
      </div>
    </main>
  );
}