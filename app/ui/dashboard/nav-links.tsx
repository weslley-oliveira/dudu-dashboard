'use client';

import {
  UserGroupIcon,
  HomeIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { FaMotorcycle, FaBuilding } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { IoPeopleSharp } from "react-icons/io5";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Users',
    href: '/dashboard/users',
    icon: UserGroupIcon,
  },
  {
    name: 'Vehicles',
    href: '/dashboard/motos',
    icon: FaMotorcycle,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: IoPeopleSharp },
  { name: 'Products', href: '/dashboard/products', icon: FaCartShopping },
  { name: 'Categories', href: '/dashboard/categories', icon: PlusCircleIcon },
  { name: 'Companies', href: '/dashboard/companies', icon: FaBuilding }, // Novo item de navegação para Companies
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}