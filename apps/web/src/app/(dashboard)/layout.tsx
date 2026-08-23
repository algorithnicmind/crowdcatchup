'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useMapStore } from '@/stores/map-store';
import dynamic from 'next/dynamic';

import { Header } from '@/components/layout/Header';
import { LocationGate } from '@/components/dashboard/citizen/LocationGate';

const PoliceSidebar = dynamic(() => import('@/components/layout/PoliceSidebar').then(m => m.PoliceSidebar), { ssr: false });
const AuthorityLayoutSidebar = dynamic(() => import('@/components/layout/AuthorityLayoutSidebar').then(m => m.AuthorityLayoutSidebar), { ssr: false });
const OwnerLayoutSidebar = dynamic(() => import('@/components/layout/OwnerLayoutSidebar').then(m => m.OwnerLayoutSidebar), { ssr: false });
const CitizenLayoutSidebar = dynamic(() => import('@/components/layout/CitizenLayoutSidebar').then(m => m.CitizenLayoutSidebar), { ssr: false });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { setRole } = useAuthStore();
  const { isSidebarOpen } = useMapStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/authority')) setRole('AUTHORITY');
    else if (pathname.startsWith('/police')) setRole('POLICE');
    else if (pathname.startsWith('/citizen')) setRole('CITIZEN');
    else if (pathname.startsWith('/owner')) setRole('EVENT_OWNER');
  }, [pathname, setRole]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }
  
  const isPolice = pathname?.startsWith('/police');
  const isAuthority = pathname?.startsWith('/authority');
  const isOwner = pathname?.startsWith('/owner');
  const isCitizen = pathname?.startsWith('/citizen');

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-white overflow-hidden">
      {/* Desktop Sidebar - only the matching role's sidebar is loaded */}
      <div className={`hidden md:block transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[260px] translate-x-0' : 'w-0 -translate-x-full opacity-0'}`}>
        {isPolice && <PoliceSidebar />}
        {isAuthority && <AuthorityLayoutSidebar />}
        {isOwner && <OwnerLayoutSidebar />}
        {isCitizen && <CitizenLayoutSidebar />}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-[#09090b]">
          <LocationGate>
            {children}
          </LocationGate>
        </main>
      </div>
    </div>
  );
}
