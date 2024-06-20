import Link from 'next/link';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav>
      <ul className="flex justify-center">
        {pages.map((page) => (
          <li key={page}>
            <Link
              href={`?page=${page}`}
              className="mx-1 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-200"
            >
              {page}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}