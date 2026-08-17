'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

import { Sidebar } from '@/components/layout/Sidebar';
import { PoliceSidebar } from '@/components/layout/PoliceSidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { setRole } = useAuthStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Sync role based on current path
  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/authority')) setRole('AUTHORITY');
    else if (pathname.startsWith('/police')) setRole('POLICE');
    else if (pathname.startsWith('/citizen')) setRole('CITIZEN');
    else if (pathname.startsWith('/owner')) setRole('EVENT_OWNER');
  }, [pathname, setRole]);

  // Clerk middleware handles auth guarding

  // Prevent flash of hydration
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }
  
  const isPolice = pathname?.startsWith('/police');

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        {isPolice ? <PoliceSidebar /> : <Sidebar />}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#09090b]">
          {children}
        </main>
      </div>
    </div>
  );
}
