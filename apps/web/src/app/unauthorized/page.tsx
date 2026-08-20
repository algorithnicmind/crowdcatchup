"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

export default function UnauthorizedPage() {
  const { logout } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
      <p className="text-lg text-muted-foreground mb-8">
        You do not have permission to access this page.
      </p>
      <div className="space-x-4">
        <Button onClick={() => window.location.href = "/"} variant="outline">
          Return Home
        </Button>
        <Button onClick={() => {
          logout();
          window.location.href = "/login";
        }} variant="destructive">
          Sign In with Different Account
        </Button>
      </div>
    </div>
  );
}
