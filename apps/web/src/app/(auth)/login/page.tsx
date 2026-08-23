import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { SlidingAuth } from '@/components/auth/SlidingAuth';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}>
      <SlidingAuth initialMode="login" />
    </Suspense>
  );
}
