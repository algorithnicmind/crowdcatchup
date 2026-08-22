"use client";

import {
  useEffect,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* --- Fonts --- */

/**
 * The two faces this hero is drawn in. Averia Serif Libre carries the
 * headline; General Sans carries everything else.
 *
 * They load from a stylesheet link rather than a bundler import so the file
 * stays self-contained — drop it in and it looks right, with no font wiring
 * required.
 */
function FontProvider() {
  return (
    <link
      rel="stylesheet"
      href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&f[]=averia-serif-libre@400,300&display=swap"
    />
  );
}

const fonts = {
  averia: { fontFamily: "'Averia Serif Libre', serif" },
  generalSans: { fontFamily: "'General Sans', sans-serif" },
};

/* --- Grain Overlay --- */

function Noise() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-50 h-full w-full opacity-20"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        mixBlendMode: "overlay",
      }}
    />
  );
}

/* --- Internal Button --- */

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary";
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
}

function HeroButton({
  variant = "primary",
  className,
  children,
  icon,
  ...props
}: ButtonProps) {
  return (
    <a
      {...props}
      style={{ ...fonts.generalSans, ...props.style }}
      className={cn(
        // Base structure
        "group relative flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap px-6 py-3 font-medium transition-all duration-300",
        // Soft rounded corners
        "rounded-2xl",
        // Variant styling
        variant === "primary"
          ? "bg-[#D8D2C2] text-[#4A4737] hover:bg-[#EAE4D2]" // Sandy/bone color
          : "bg-black/10 text-white backdrop-blur-md hover:bg-black/20",
        // Conditional borders
        variant === "secondary" && "border border-white/10",
        className,
      )}
    >
      {/* 
        Subtle gradient shine on hover (only really visible on primary)
        Using a pseudo-element style setup but built with utility classes 
      */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 ease-in-out group-hover:translate-x-full" />

      {/* Button content */}
      <span className="relative z-10">{children}</span>

      {/* Optional icon, subtly animating in on hover */}
      {icon && (
        <span className="relative z-10 -ml-1 inline-flex opacity-70 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100">
          {icon}
        </span>
      )}
    </a>
  );
}

/* --- Types --- */

export interface GhibliHeroProps {
  /**
   * Main headline. Use a <br/> if you need a specific line break.
   */
  title: ReactNode;
  /**
   * Secondary text sitting just below the title.
   */
  subtitle: string;
  /**
   * The text inside the primary call to action button.
   */
  ctaLabel?: string;
  /**
   * Where the primary CTA should link to.
   */
  ctaHref?: string;
  /**
   * Any additional className to place on the outermost container.
   */
  className?: string;
}

/* --- Main Component --- */

export function GhibliRobotHero({
  title,
  subtitle,
  ctaLabel = "Explore",
  ctaHref = "#",
  className,
}: GhibliHeroProps) {
  // A subtle entrance animation logic for the content blocks.
  // We handle it simply with a mounted state to keep dependencies light.
  useEffect(() => {
    document.body.dataset.mounted = "true";
  }, []);

  return (
    <>
      <FontProvider />
      <section
        className={cn(
          "relative flex min-h-[90vh] w-full flex-col justify-between overflow-hidden sm:min-h-screen",
          "bg-[#0A0B09]", // A very dark, earthy green/black base
          className,
        )}
      >
        {/* Background Setup */}
        <div className="absolute inset-0 z-0">
          {/* 
            The gradients are the secret sauce. 
            We need a strong bottom vignette to anchor the text, 
            and a subtle overall overlay to ensure contrast. 
          */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B09] via-[#0A0B09]/40 to-transparent" />
          <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        </div>

        {/* Global Noise Overlay */}
        <Noise />

        {/* Top Navigation / Branding Area (Optional, structural) */}
        <header className="relative z-10 flex w-full items-center justify-between p-6 sm:p-10">
          {/* 
            You could place a logo here. 
            For now, we leave it empty to match the clean aesthetic of the source image,
            but keeping the structural space.
          */}
          <div className="h-8 w-24" />
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex w-full flex-col items-center justify-end px-6 pb-20 sm:pb-32">
          <div className="flex max-w-4xl flex-col items-center space-y-6 text-center">
            {/* Title */}
            <h1
              style={{ ...fonts.averia, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
              className="animate-in slide-in-from-bottom-4 fade-in-0 text-5xl font-light leading-[1.1] tracking-tight text-[#FAF9F6] duration-1000 fill-mode-both sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p
              style={fonts.generalSans}
              className="animate-in slide-in-from-bottom-4 fade-in-0 max-w-xl text-lg font-medium text-[#D8D2C2]/80 duration-1000 delay-200 fill-mode-both sm:text-xl"
            >
              {subtitle}
            </p>

            {/* Actions */}
            <div className="animate-in slide-in-from-bottom-4 fade-in-0 mt-8 flex flex-wrap items-center justify-center gap-4 duration-1000 delay-300 fill-mode-both">
              <HeroButton
                href={ctaHref}
                variant="primary"
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                }
              >
                {ctaLabel}
              </HeroButton>
            </div>
          </div>
        </main>
      </section>
    </>
  );
}
