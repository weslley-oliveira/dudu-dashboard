'use client';

import React, { useState, useEffect } from 'react';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  CubeIcon,
  UserGroupIcon,
  BanknotesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { FaMotorcycle } from "react-icons/fa";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface NavItem {
  name: string;
  href?: string;
  icon?: React.ElementType;
  subItems?: NavItem[];
  isAction?: boolean;
}

const navItems: NavItem[] = [
  {
    name: 'Home',
    icon: HomeIcon,
    href: '/dashboard',
  },
  {
    name: 'Sales',
    icon: ClipboardDocumentListIcon,
    href: '/dashboard/sales', 
    subItems: [
      { name: 'Register Sale', href: '/dashboard/sales/create', isAction: true },
      { name: 'Manage Sales', href: '/dashboard/sales' },
      { name: 'Register Service', href: '/dashboard/sales/create', isAction: true },
      { name: 'Manage Services', href: '/dashboard/sales' },
    ],
  },
  {
    name: 'Rentals',
    icon: FaMotorcycle,
    href: '/dashboard/rentals',
    subItems: [
      { name: 'Register Rental', href: '/dashboard/rentals/create', isAction: true },
      { name: 'Manage Rentals', href: '/dashboard/rentals' },
    ],
  },
  {
    name: 'Inventory',
    icon: CubeIcon,
    href: '/dashboard/inventory',
    subItems: [
      {
        name: 'Purchases',
        href: '/dashboard/inventory/purchases',
        subItems: [
          { name: 'Register Purchase', href: '/dashboard/inventory/purchases/create', isAction: true },
          { name: 'Manage Purchases', href: '/dashboard/inventory/purchases' },
        ],
      },
      {
        name: 'Parts',
        href: '/dashboard/inventory/parts',
        subItems: [
          { name: 'Register Part', href: '/dashboard/inventory/parts/create', isAction: true },
          { name: 'Manage Parts', href: '/dashboard/inventory/parts' },
        ],
      },
      {
        name: 'Products',
        href: '/dashboard/inventory/products',
        subItems: [
          { name: 'Register Product', href: '/dashboard/inventory/products/create', isAction: true },
          { name: 'Manage Products', href: '/dashboard/inventory/products' },
        ],
      },
      {
        name: 'Vehicles',
        href: '/dashboard/inventory/vehicles',
        subItems: [
          { name: 'Register Vehicle', href: '/dashboard/inventory/vehicles/create', isAction: true },
          { name: 'Manage Vehicles', href: '/dashboard/inventory/vehicles' },
        ],
      },
    ],
  },
  {
    name: 'Management',
    icon: UserGroupIcon,
    href: '/dashboard/management',
    subItems: [
      {
        name: 'Suppliers',
        href: '/dashboard/management/suppliers',
        subItems: [
          { name: 'Register Supplier', href: '/dashboard/management/suppliers/create', isAction: true },
          { name: 'Manage Suppliers', href: '/dashboard/management/suppliers' },
        ],
      },
      {
        name: 'Customers',
        href: '/dashboard/management/customers',
        subItems: [
          { name: 'Register Customer', href: '/dashboard/management/customers/create', isAction: true },
          { name: 'Manage Customers', href: '/dashboard/management/customers' },
        ],
      },
      {
        name: 'Employees',
        href: '/dashboard/management/employees',
        subItems: [
          { name: 'Register Employee', href: '/dashboard/management/employees/create', isAction: true },
          { name: 'Manage Employees', href: '/dashboard/management/employees' },
        ],
      },
      {
        name: 'Companies',
        href: '/dashboard/management/companies',
        subItems: [
          { name: 'Register Company', href: '/dashboard/management/companies/create', isAction: true },
          { name: 'Manage Companies', href: '/dashboard/management/companies' },
        ],
      },
      {
        name: 'Users',
        href: '/dashboard/management/users',
        subItems: [
          { name: 'Register User', href: '/dashboard/management/users/create', isAction: true },
          { name: 'Manage Users', href: '/dashboard/management/users' },
        ],
      },
    ],
  },
  {
    name: 'Finance',
    icon: BanknotesIcon,
    href: '/dashboard/finance',
    subItems: [
      { name: 'Transactions', href: '/dashboard/finance' },
      { name: 'Financial Reports', href: '/dashboard/finance/payments' },
      { name: 'Register Payment', href: '/dashboard/finance/payments/create', isAction: true },
    ],
  },
];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize); // Add resize listener

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up resize listener
    };
  }, []);

  return isMobile;
};

const NavItemComponent: React.FC<{ item: NavItem; depth: number; isOpen: boolean; onToggle: () => void; isMobile: boolean }> = ({ item, depth, isOpen, onToggle, isMobile }) => {
  const pathname = usePathname();
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const [openSubItems, setOpenSubItems] = useState<string | null>(null);

  const handleSubToggle = (name: string) => {
    setOpenSubItems((prevOpenSubItems) => (prevOpenSubItems === name ? null : name));
  };

  const isActive = item.href === pathname || (hasSubItems && item.subItems?.some(subItem => subItem.href === pathname));

  return (
    <div>
      <Link href={item.href || '#'} className={clsx('bg-gray-100 flex p-3 rounded-md hover:bg-sky-100 hover:text-blue-600 cursor-pointer', { 'bg-sky-100 text-blue-600': isActive })} onClick={onToggle}>
        <div className="flex justify-between items-center gap-2 w-full rounded-md text-sm " >
          <div className='flex gap-2'>
            {item.icon && <item.icon className="w-5 h-5" />}
            {!isMobile && <span>{item.name}</span>}
          </div>
            {hasSubItems && (
              isOpen ? <ChevronUpIcon className="w-4 h-4 hidden md:inline" /> : <ChevronDownIcon className="w-4 h-4 hidden md:inline" />
            )}
          {item.isAction && <PlusCircleIcon className="w-4 h-4 ml-auto hidden md:inline" />}
        </div>
      </Link>
      {hasSubItems && isOpen && (


        <div className={`ml-4 mt-1 space-y-1  ${isMobile ? ' bg-yellow-100 hidden' : ''}`}>
          {item.subItems?.map((subItem, index) => (
            <NavItemComponent
              key={`${subItem.name}-${index}`}
              item={subItem}
              depth={depth + 1}
              isOpen={openSubItems === subItem.name}
              onToggle={() => handleSubToggle(subItem.name)}
              isMobile={isMobile}
            />
          ))}
        </div>


      )}
    </div>
  );
};

export default function NavLinks() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleToggle = (name: string) => {
    setOpenItem((prevOpenItem) => (prevOpenItem === name ? null : name));
  };

  return (
    <nav className="flex md:flex-col w-full gap-1 justify-between ">
      {navItems.map((item, index) => (
        <NavItemComponent
          key={`${item.name}-${index}`}
          item={item}
          depth={0}
          isOpen={openItem === item.name}
          onToggle={() => handleToggle(item.name)}
          isMobile={isMobile}
        />
      ))}
    </nav>
  );
}
