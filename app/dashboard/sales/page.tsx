import Pagination from '@/app/ui/sales/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/sales/table';
import { CreateSale } from '@/app/ui/sales/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton as SalesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchSalesPages } from '@/app/lib/sales/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sales',
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

  const totalPages = await fetchSalesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Sales</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search sales..." />
        <CreateSale />
      </div>
      <Suspense key={query + currentPage} fallback={<SalesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
