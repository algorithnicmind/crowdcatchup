"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { apiClient } from "@/lib/api-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiClient<{ access_token: string; token_type: string }>("/auth/login", {
        method: "POST",
        requireAuth: false,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email, // OAuth2 spec uses username for email
          password: password,
        }).toString(),
      });

      // Fetch user profile immediately after getting token
      localStorage.setItem("token", data.access_token);
      
      const user = await apiClient<any>("/auth/me", { requireAuth: true });
      
      setAuth(user, data.access_token);
      
      // Role-based routing
      if (user.role === "AUTHORITY") router.push("/authority");
      else if (user.role === "POLICE") router.push("/police");
      else if (user.role === "CITIZEN") router.push("/citizen");
      else if (user.role === "EVENT_OWNER") router.push("/owner");
      else router.push("/");
      
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-white/10 bg-black/40 backdrop-blur-xl text-white shadow-2xl">
      <CardHeader className="space-y-1 items-center pb-8">
        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
          <Shield className="w-6 h-6 text-emerald-500" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome to CrowdShield</CardTitle>
        <CardDescription className="text-zinc-400">
          Enter your email to sign in to your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
            </div>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-500"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-emerald-500 hover:text-emerald-400 transition-colors">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
