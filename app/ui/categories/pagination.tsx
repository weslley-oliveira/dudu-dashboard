'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1
  );

  const handlePageChange = (page: number) => {
    const query = searchParams.get('query') || '';
    setCurrentPage(page);
    router.push(`/dashboard/categories?query=${query}&page=${page}`);
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="mx-2 flex items-center justify-center text-sm font-medium text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ml-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}