import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface SidebarLinkProps {
  href: string;
  label: string;
  pathname: string;
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <nav className="space-y-2">
        <SidebarLink href="/dashboard" label="Dashboard" pathname={pathname} />
        <SidebarLink href="/dashboard/triggers" label="Triggers" pathname={pathname} />
        <SidebarLink href="/dashboard/templates" label="Templates" pathname={pathname} />
      </nav>
    </div>
  );
}

function SidebarLink({ href, label, pathname }: SidebarLinkProps) {
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <Button variant={isActive ? 'primary' : 'outline'} className="w-full justify-start">
        {label}
      </Button>
    </Link>
  );
}