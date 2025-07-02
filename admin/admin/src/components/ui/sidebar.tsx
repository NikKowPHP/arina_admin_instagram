'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
interface SidebarLinkProps {
  href: string;
  label: string;
  pathname: string;
}

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      <div className={`${isOpen ? 'block' : 'hidden'} md:block h-full bg-gray-900 p-4 border-r border-gray-800`}>
      <h2 className="text-2xl font-semibold text-white mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <SidebarLink href="/dashboard" label="Dashboard" pathname={pathname} />
        <SidebarLink href="/dashboard/triggers" label="Triggers" pathname={pathname} />
        <SidebarLink href="/dashboard/templates" label="Templates" pathname={pathname} />
        <SidebarLink href="/dashboard/errors" label="Error Queue" pathname={pathname} />
      </nav>
      </div>
    </>
  );
}

function SidebarLink({ href, label, pathname }: SidebarLinkProps) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium
        ${isActive
          ? 'bg-gray-800 text-white border-l-4 border-blue-500'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }
        transition-colors duration-200 ease-in-out`}
    >
      {label}
    </Link>
  );
}