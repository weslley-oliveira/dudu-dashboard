import EditCategoryForm from '@/app/ui/categories/EditCategoryForm';
import Breadcrumbs from '@/app/ui/categories/breadcrumbs';
import { fetchCategoryById } from '@/app/lib/categories/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Category',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const category = await fetchCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Categories', href: '/dashboard/categories' },
          {
            label: 'Edit Category',
            href: `/dashboard/categories/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditCategoryForm category={category} />
    </main>
  );
}