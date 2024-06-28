import Pagination from '@/app/ui/item-requests/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/item-requests/table';
import { CreateItemRequest } from '@/app/ui/item-requests/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton as ItemRequestsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchItemRequestsPages } from '@/app/lib/item-requests/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Item Requests',
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

  const totalPages = await fetchItemRequestsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Item Requests</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search item requests..." />
        <CreateItemRequest />
      </div>
      <Suspense key={query + currentPage} fallback={<ItemRequestsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}