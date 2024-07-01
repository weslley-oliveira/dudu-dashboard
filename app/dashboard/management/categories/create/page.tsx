import CreateCategoryForm from '@/app/ui/categories/CreateCategoryForm';
import Breadcrumbs from '@/app/ui/categories/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Category',
};

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Categories', href: '/dashboard/categories' },
          {
            label: 'Create Category',
            href: '/dashboard/categories/create',
            active: true,
          },
        ]}
      />
      <CreateCategoryForm />
    </main>
  );
}