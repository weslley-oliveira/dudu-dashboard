import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

type Breadcrumb = {
  label: string;
  href: string;
  active?: boolean;
};

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <ChevronRightIcon className="w-4 h-4 text-gray-500" />}
            {breadcrumb.active ? (
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                {breadcrumb.label}
              </span>
            ) : (
              <a className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                  <Link href={breadcrumb.href}>
                  {breadcrumb.label}
              </Link>
                </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}