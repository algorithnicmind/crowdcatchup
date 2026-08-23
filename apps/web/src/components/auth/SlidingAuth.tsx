"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore, UserRole } from '@/stores/auth-store';
import { useUserStore } from '@/stores/user-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, User, Lock, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SlidingAuthProps {
  initialMode?: 'login' | 'register';
}

export function SlidingAuth({ initialMode = 'login' }: SlidingAuthProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');
  
  const setAuth = useAuthStore(state => state.setAuth);
  const { getUserByEmailOrPhone } = useUserStore();

  const [isSignUp, setIsSignUp] = useState(initialMode === 'register');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');

  // Login State
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { apiClient } = await import('@/lib/api-client');
      // 1. Call Backend Login
      const data = await apiClient<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password: loginPassword })
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
      // Demo Mode Fallback
      const DEMO_ACCOUNTS: Record<string, { name: string; role: UserRole }> = {
        'admin@test.com':   { name: 'Admin Authority', role: 'AUTHORITY' },
        'police@test.com':  { name: 'Police Officer',  role: 'POLICE' },
        'owner@test.com':   { name: 'Event Owner',     role: 'EVENT_OWNER' },
        'citizen@test.com': { name: 'Citizen One',     role: 'CITIZEN' },
        'citizen2@test.com':{ name: 'Citizen Two',     role: 'CITIZEN' },
        'citizen3@test.com':{ name: 'Citizen Three',   role: 'CITIZEN' },
      };

      const demo = DEMO_ACCOUNTS[identifier.toLowerCase()];
      if (demo && loginPassword === 'Password123!') {
        toast.info('Backend offline - signing in with demo account.');
        setAuth(
          { id: `demo-${identifier}`, name: demo.name, email: identifier, phone: '' },
          demo.role,
          'demo-token'
        );
        const defaultRoute = demo.role === 'EVENT_OWNER' ? '/owner' : `/${demo.role.toLowerCase()}`;
        router.push(redirectUrl || defaultRoute);
      } else {
        toast.error('Invalid credentials. Backend may be offline - try a demo account.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const existingUser = getUserByEmailOrPhone(email, 'CITIZEN') || getUserByEmailOrPhone(phone, 'CITIZEN');
    if (existingUser) {
      toast.error('An account with this email or phone already exists.');
      setIsLoading(false);
      return;
    }

    const otp = "123456";
    setGeneratedOtp(otp);
    
    toast.success('Demo Mode: Enter 123456 to verify.');
    setStep('OTP');
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (true) { // Demo mode bypass
        const { apiClient } = await import('@/lib/api-client');
        
        // 1. Register User in Backend
        const newUser = await apiClient<any>('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            email,
            phone_number: phone,
            password: registerPassword,
            full_name: name,
            role: 'CITIZEN'
          })
        });

        // 2. Automatically Log them in
        const loginData = await apiClient<{ access_token: string }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ identifier: email, password: registerPassword })
        });
        
        const validUser = {
          id: newUser.id,
          name: newUser.full_name,
          email: newUser.email,
          phone: newUser.phone_number
        };

        setAuth(validUser, 'CITIZEN', loginData.access_token);
        router.push('/citizen');
      }
    } catch {
      toast.error('Failed to connect to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E5E5] p-4 font-sans text-zinc-900 overflow-hidden relative">
      <div className="relative w-full max-w-[850px] h-[550px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex shadow-indigo-500/10">
        
        {/* ================= SIGN UP FORM CONTAINER (Left) ================= */}
        <div className={cn(
          "absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out px-10 flex flex-col justify-center bg-white",
          isSignUp ? "translate-x-full opacity-100 z-50" : "opacity-0 z-1 pointer-events-none"
        )}>
          {step === 'FORM' ? (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col items-center space-y-4 w-full max-w-xs mx-auto">
              <h1 className="text-4xl font-bold mb-4 text-zinc-800">Sign up</h1>
              
              <div className="relative w-full">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input required type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} className="bg-zinc-100 border-none h-11 pl-10 rounded-lg text-sm" />
              </div>
              <div className="relative w-full">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-zinc-100 border-none h-11 pl-10 rounded-lg text-sm" />
              </div>
              <div className="relative w-full">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input required type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} className="bg-zinc-100 border-none h-11 pl-10 rounded-lg text-sm" />
              </div>

              <Button type="submit" disabled={isLoading} className="w-36 bg-[#5A63E0] hover:bg-indigo-600 text-white rounded-full h-11 font-bold tracking-wider mt-2 text-xs">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "SIGN UP"}
              </Button>

              <div className="mt-4 text-center text-zinc-500 text-xs flex flex-col items-center space-y-3">
                  <p>Or sign up with social platforms</p>
                  <div className="flex gap-3">
                      <button type="button" className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-red-500 hover:bg-zinc-50 font-bold">G</button>
                      <button type="button" className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-blue-500 hover:bg-zinc-50 font-bold">f</button>
                      <button type="button" className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-sky-500 hover:bg-zinc-50 font-bold">t</button>
                      <button type="button" className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-blue-700 hover:bg-zinc-50 font-bold">in</button>
                  </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col items-center space-y-4 w-full max-w-xs mx-auto">
              <h1 className="text-4xl font-bold mb-4 text-zinc-800">Verify OTP</h1>
              <p className="text-zinc-500 text-center text-sm mb-4">Enter the code sent to your email.</p>
              <div className="relative w-full">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input required type="text" placeholder="123456" value={userOtp} onChange={(e) => setUserOtp(e.target.value)} className="bg-zinc-100 border-none h-11 pl-10 rounded-lg text-center tracking-[0.5em]" />
              </div>
              <Button type="submit" disabled={isLoading} className="w-36 bg-[#5A63E0] hover:bg-indigo-600 text-white rounded-full h-11 font-bold tracking-wider mt-4 text-xs">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "VERIFY"}
              </Button>
            </form>
          )}
        </div>

        {/* ================= SIGN IN FORM CONTAINER (Right) ================= */}
        <div className={cn(
          "absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out px-10 flex flex-col justify-center bg-white",
          isSignUp ? "translate-x-full opacity-0 z-1 pointer-events-none" : "translate-x-0 opacity-100 z-50"
        )}>
          <form onSubmit={handleLogin} className="flex flex-col items-center space-y-4 w-full max-w-xs mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-zinc-800">Sign in</h1>
            
            <div className="relative w-full">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input required type="text" placeholder="Email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="bg-zinc-100 border-none h-11 pl-10 rounded-lg text-sm" />
            </div>
            <div className="relative w-full">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input required type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="bg-zinc-100 border-none h-11 pl-10 rounded-lg text-sm" />
            </div>

            <Button type="submit" disabled={isLoading} className="w-36 bg-[#5A63E0] hover:bg-indigo-600 text-white rounded-full h-11 font-bold tracking-wider mt-4 text-xs">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "LOGIN"}
            </Button>
            
            <div className="mt-8 text-center text-zinc-500 text-xs flex flex-col items-center space-y-3">
                <p>Or sign in with social platforms</p>
                <div className="flex gap-3">
                    <button type="button" className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-red-500 hover:bg-zinc-50 font-bold">G</button>
                    <button type="button" className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-blue-500 hover:bg-zinc-50 font-bold">f</button>
                    <button type="button" className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-sky-500 hover:bg-zinc-50 font-bold">t</button>
                    <button type="button" className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-blue-700 hover:bg-zinc-50 font-bold">in</button>
                </div>
            </div>
          </form>
        </div>

        {/* ================= SLIDING OVERLAY ================= */}
        <div className={cn(
          "absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100]",
          isSignUp ? "-translate-x-full" : "translate-x-0"
        )}>
          {/* The background panel that stays visually in place by moving in the opposite direction */}
          <div className={cn(
            "bg-gradient-to-br from-[#6C5CE7] to-[#8854D0] relative -left-full h-full w-[200%] transform transition-all duration-700 ease-in-out text-white",
            isSignUp ? "translate-x-1/2 rounded-r-[120px]" : "translate-x-0 rounded-l-[120px]"
          )}>
            
            {/* Overlay Left (Visible when Sign Up is active) */}
            <div className={cn(
              "absolute w-1/2 h-full flex flex-col items-center justify-center px-12 text-center transition-transform duration-700 ease-in-out",
              isSignUp ? "translate-x-0" : "-translate-x-[20%]"
            )}>
              <h2 className="text-3xl font-bold mb-4">One of us?</h2>
              <p className="mb-8 text-indigo-50 text-sm">Welcome back! Sign in to continue your<br/>journey with us.</p>
              <button 
                onClick={() => setIsSignUp(false)} 
                className="border border-white rounded-full px-12 py-2.5 font-bold tracking-wider hover:bg-white hover:text-[#6C5CE7] transition-colors text-xs"
              >
                SIGN IN
              </button>
            </div>

            {/* Overlay Right (Visible when Sign In is active) */}
            <div className={cn(
              "absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-12 text-center transition-transform duration-700 ease-in-out",
              isSignUp ? "translate-x-[20%]" : "translate-x-0"
            )}>
              <h2 className="text-3xl font-bold mb-4">New here?</h2>
              <p className="mb-8 text-indigo-50 text-sm">Join us today and discover a world of<br/>possibilities. Create your account in seconds!</p>
              <button 
                onClick={() => setIsSignUp(true)} 
                className="border border-white rounded-full px-12 py-2.5 font-bold tracking-wider hover:bg-white hover:text-[#6C5CE7] transition-colors text-xs"
              >
                SIGN UP
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
