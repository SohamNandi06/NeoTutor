'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Companions', href: '/companions' },
  { label: 'My Journey', href: '/my-journey' },
  { label: 'Subscriptions', href: '/subscription' }
];

interface NavItemsProps {
  isMobile?: boolean;
}

const NavItems = ({ isMobile = false }: NavItemsProps) => {
  const pathname = usePathname();

  return (
    <nav className={cn('gap-4', isMobile ? 'flex flex-col items-center' : 'flex items-center')}>
      {navItems.map(({ label, href }) => (
        <Link
          href={href}
          key={label}
          className={cn(
            'text-gray-700 hover:text-primary transition font-medium',
            pathname === href && 'text-primary font-semibold'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default NavItems;
