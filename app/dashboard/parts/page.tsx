import Pagination from '@/app/ui/parts/pagination'; // Atualizar o caminho
import Search from '@/app/ui/search';
import Table from '@/app/ui/parts/table'; // Atualizar o caminho
import { CreatePart } from '@/app/ui/parts/buttons'; // Atualizar o caminho
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton as PartsTableSkeleton } from '@/app/ui/skeletons'; // Atualizar o nome do componente
import { Suspense } from 'react';
import { fetchPartsPages } from '@/app/lib/parts/data'; // Atualizar a função de busca
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parts',
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

  const totalPages = await fetchPartsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Parts</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search parts..." />
        <CreatePart />
      </div>
      <Suspense key={query + currentPage} fallback={<PartsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}