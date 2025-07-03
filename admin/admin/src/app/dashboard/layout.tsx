'use client';

import { ReactNode } from 'react';
// No longer need useEffect, useRouter, or useSupabase here for the check
import Sidebar from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // The useEffect hook for authentication has been REMOVED.
  
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <Sidebar />
      <main className="p-4 md:p-8 bg-gray-950 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}