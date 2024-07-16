import Pagination from '@/app/ui/rentals/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/rentals/table';
import { CreateRental } from '@/app/ui/rentals/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton as RentalsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchRentalsPages } from '@/app/lib/rentals/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rentals',
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

  const totalPages = await fetchRentalsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Rentals</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search rentals..." />
        <CreateRental />
      </div>
      <Suspense key={query + currentPage} fallback={<RentalsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}