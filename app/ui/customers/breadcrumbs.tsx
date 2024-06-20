import Link from 'next/link';

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: { label: string, href: string, active?: boolean }[] }) {
  return (
    <nav className="mb-4">
      <ol className="flex flex-wrap">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {breadcrumb.active ? (
              <span className="text-gray-500">{breadcrumb.label}</span>
            ) : (
              <Link href={breadcrumb.href} className="text-blue-600 hover:underline">
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}