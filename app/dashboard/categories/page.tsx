import Pagination from '@/app/ui/categories/pagination';
import Search from '@/app/ui/search';
import CategoriesTable from '@/app/ui/categories/CategoriesTable';
import { CreateCategory } from '@/app/ui/categories/buttons';
import { lusitana } from '@/app/ui/fonts';
import { CategoriesTableSkeleton } from '@/app/ui/categories/skeletons';
import { Suspense } from 'react';
import { fetchCategoriesPages } from '@/app/lib/categories/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchCategoriesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Categories</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search categories..." />
        <CreateCategory />
      </div>
      <Suspense key={query + currentPage} fallback={<CategoriesTableSkeleton />}>
        <CategoriesTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}