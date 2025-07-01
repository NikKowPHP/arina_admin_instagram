'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/supabase-provider';
import Sidebar from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = useSupabase();
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };

    checkUserSession();
  }, [supabase, router]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <Sidebar />
      <main className="p-4 md:p-8 bg-gray-950 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}