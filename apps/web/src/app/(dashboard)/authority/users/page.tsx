"use client";

import React, { useState } from "react";

export default function CreateStaffPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("POLICE");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, fullName, role }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      setMessage({ type: "success", text: `Successfully created ${role} account for ${email}` });
      setEmail("");
      setPassword("");
      setFullName("");
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Staff Management</h1>
      <p className="text-muted-foreground mb-8">
        As the Authority (Super Admin), you can manually create accounts for Police Officers and Event Managers. Citizens must register themselves.
      </p>

      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Create New Staff Account</h2>
        
        {message && (
          <div className={`p-4 mb-6 rounded-md ${message.type === "success" ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 bg-background border rounded-md"
              placeholder="Officer John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-background border rounded-md"
              placeholder="john.doe@crowdshield.local"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Temporary Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-background border rounded-md"
              placeholder="••••••••"
              minLength={8}
            />
            <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters long.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 bg-background border rounded-md"
            >
              <option value="POLICE">Police / Security Officer</option>
              <option value="EVENT_OWNER">Event Manager / Owner</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground p-2 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 mt-4 transition-colors"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
