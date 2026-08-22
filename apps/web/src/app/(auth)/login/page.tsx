"use client";

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore, UserRole } from '@/stores/auth-store';
import { useUserStore } from '@/stores/user-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Loader2, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');
  const queryRole = searchParams.get('role');
  const initialRole = queryRole
    ? (queryRole.toUpperCase() as UserRole)
    : 'AUTHORITY';

  const setAuth = useAuthStore(state => state.setAuth);
  const { getUserByGeneratedId, getUserByEmailOrPhone } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (queryRole) {
      setRole(queryRole.toUpperCase() as UserRole);
    }
  }, [queryRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { apiClient } = await import('@/lib/api-client');
      // 1. Call Backend Login
      const data = await apiClient<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      });

      // 2. Fetch User Profile
      interface UserProfileResponse {
        id: string;
        full_name: string;
        email: string;
        phone_number: string;
        role: string;
      }
      
      const meResponse = await apiClient<UserProfileResponse>('/auth/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });
      
      const finalRole = meResponse.role as UserRole;
      const validUser = {
        id: meResponse.id,
        name: meResponse.full_name,
        email: meResponse.email,
        phone: meResponse.phone_number
      };

      setAuth(validUser, finalRole, data.access_token);
      
      let defaultRoute = `/${finalRole.toLowerCase()}`;
      if (finalRole === 'EVENT_OWNER') {
        defaultRoute = '/owner';
      }
      
      let targetUrl = redirectUrl || defaultRoute;
      
      if (targetUrl.startsWith('/event_owner')) {
        targetUrl = targetUrl.replace('/event_owner', '/owner');
      }
      
      router.push(targetUrl);
    } catch {
      // Demo Mode Fallback: if backend is offline, allow known test credentials
      const DEMO_ACCOUNTS: Record<string, { name: string; role: UserRole }> = {
        'admin@test.com':   { name: 'Admin Authority', role: 'AUTHORITY' },
        'police@test.com':  { name: 'Police Officer',  role: 'POLICE' },
        'owner@test.com':   { name: 'Event Owner',     role: 'EVENT_OWNER' },
        'citizen@test.com': { name: 'Citizen One',     role: 'CITIZEN' },
        'citizen2@test.com':{ name: 'Citizen Two',     role: 'CITIZEN' },
        'citizen3@test.com':{ name: 'Citizen Three',   role: 'CITIZEN' },
      };

      const demo = DEMO_ACCOUNTS[identifier.toLowerCase()];
      if (demo && password === 'Password123!') {
        toast.info('Backend offline — signing in with demo account.');
        setAuth(
          { id: `demo-${identifier}`, name: demo.name, email: identifier, phone: '' },
          demo.role,
          'demo-token'
        );
        const defaultRoute = demo.role === 'EVENT_OWNER' ? '/owner' : `/${demo.role.toLowerCase()}`;
        router.push(redirectUrl || defaultRoute);
      } else {
        toast.error('Invalid credentials. Backend may be offline — try a demo account.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 w-full max-w-md bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">CROWDSHIELD</h1>
          <p className="text-zinc-500 text-sm mt-2">Universal Access Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-zinc-400 uppercase text-xs tracking-widest font-bold">
              Email, Phone, or Assigned ID
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                required
                type="text" 
                placeholder="name@example.com or ID-XXXXXX"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700 pl-10"
              />
            </div>
            {role === 'AUTHORITY' && <p className="text-xs text-zinc-500">Demo: admin@test.com / Password123!</p>}
            {role === 'POLICE' && <p className="text-xs text-zinc-500">Demo: police@test.com / Password123!</p>}
            {role === 'CITIZEN' && <p className="text-xs text-zinc-500">Demo: citizen@test.com / Password123!</p>}
            {role === 'EVENT_OWNER' && <p className="text-xs text-zinc-500">Demo: owner@test.com / Password123!</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-400 uppercase text-xs tracking-widest font-bold">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                required
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700 pl-10 pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "AUTHENTICATE"}
          </Button>

          {role === 'CITIZEN' && (
            <div className="text-center pt-4 border-t border-zinc-800 mt-6">
              <p className="text-zinc-500 text-sm">
                Don't have an account?{' '}
                <Link href="/register?role=CITIZEN" className="text-emerald-500 hover:text-emerald-400 transition-colors">
                  Register here
                </Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}>
      <LoginPageInner />
    </Suspense>
  );
}
