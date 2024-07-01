import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employees',
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

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Rentals</h1>
      </div>
    </div>
  );
}