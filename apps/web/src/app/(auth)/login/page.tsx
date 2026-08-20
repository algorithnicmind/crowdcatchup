"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore, UserRole } from '@/stores/auth-store';
import { useUserStore } from '@/stores/user-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Loader2, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LoginPage() {
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
  const [identifier, setIdentifier] = useState(''); // ID, Email, or Phone
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      let validUser = null;

      if (role === 'AUTHORITY') {
        if (identifier === 'admin' && password === 'admin123') {
          validUser = { id: 'admin_1', name: 'Command Center Admin' };
        } else {
          toast.error('Invalid Authority credentials. Use admin / admin123');
          return;
        }
      } else if (role === 'POLICE' || role === 'EVENT_OWNER') {
        const found = getUserByGeneratedId(identifier, role);
        if (found && found.password === password) {
          validUser = { id: found.id, name: found.name };
        } else {
          toast.error(`Invalid ${role} ID or password.`);
          return;
        }
      } else if (role === 'CITIZEN') {
        const found = getUserByEmailOrPhone(identifier, role);
        if (found && found.password === password) {
          validUser = { id: found.id, name: found.name, email: found.email, phone: found.phone };
        } else {
          toast.error('Invalid Email/Phone or password.');
          return;
        }
      }

      if (validUser) {
        const mockToken = "mock_jwt_token_" + Date.now();
        setAuth(validUser, role, mockToken);
        const targetUrl = redirectUrl || `/${role.toLowerCase()}`;
        router.push(targetUrl);
      }
    }, 1000);
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
          <p className="text-zinc-500 text-sm mt-2">Secure Access Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-zinc-400 uppercase text-xs tracking-widest font-bold">Role Access</Label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full h-10 px-3 rounded-md border border-zinc-800 bg-zinc-900 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="AUTHORITY">Command Center Authority</option>
              <option value="POLICE">Field Police Officer</option>
              <option value="EVENT_OWNER">Event Owner</option>
              <option value="CITIZEN">Citizen</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-400 uppercase text-xs tracking-widest font-bold">
              {role === 'CITIZEN' ? 'Email or Phone Number' : 'Assigned ID'}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                required
                type="text" 
                placeholder={role === 'AUTHORITY' ? "admin" : (role === 'CITIZEN' ? 'name@example.com' : 'ID-XXXXXX')}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700 pl-10"
              />
            </div>
            {role === 'AUTHORITY' && <p className="text-xs text-zinc-500">Hint: admin / admin123</p>}
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
                <Link href="/register" className="text-emerald-500 hover:text-emerald-400 transition-colors">
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
