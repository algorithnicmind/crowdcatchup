import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrowdShield",
  description: "AI-Powered Multi-Source Early Warning System",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CrowdShield",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from 'sonner';
import { SmoothScrolling } from "@/components/providers/SmoothScrolling";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SmoothScrolling>
          <TooltipProvider>
            {children}
            <Toaster theme="dark" position="top-right" />
          </TooltipProvider>
        </SmoothScrolling>
      </body>
    </html>
  );
}

