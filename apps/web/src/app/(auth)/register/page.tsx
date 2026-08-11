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

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CITIZEN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Register User
      await apiClient("/auth/register", {
        method: "POST",
        requireAuth: false,
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          role,
        }),
      });

      // 2. Auto-login immediately after
      const loginData = await apiClient<{ access_token: string }>("/auth/login", {
        method: "POST",
        requireAuth: false,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password: password }).toString(),
      });

      localStorage.setItem("token", loginData.access_token);
      
      // 3. Fetch Profile
      const user = await apiClient<any>("/auth/me", { requireAuth: true });
      setAuth(user, loginData.access_token);
      
      // 4. Role-based routing
      if (user.role === "AUTHORITY") router.push("/authority");
      else if (user.role === "POLICE") router.push("/police");
      else if (user.role === "CITIZEN") router.push("/citizen");
      else if (user.role === "EVENT_OWNER") router.push("/owner");
      
    } catch (err: any) {
      setError(err.message || "Registration failed");
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
        <CardTitle className="text-2xl font-bold tracking-tight">Join CrowdShield</CardTitle>
        <CardDescription className="text-zinc-400">
          Create a secure account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-zinc-300">First Name</Label>
              <Input 
                id="firstName" 
                required 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-zinc-300">Last Name</Label>
              <Input 
                id="lastName" 
                required 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-zinc-300">System Role</Label>
            <select 
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="CITIZEN">Citizen / Attendee</option>
              <option value="POLICE">Police Officer</option>
              <option value="AUTHORITY">Command Authority</option>
              <option value="EVENT_OWNER">Event Organizer</option>
            </select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
          <div className="text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-500 hover:text-emerald-400 transition-colors">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
