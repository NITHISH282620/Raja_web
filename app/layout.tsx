import type { Metadata, Viewport } from "next";
import { Poppins, Roboto_Mono } from "next/font/google";
import { MotionProvider } from "@/motion/MotionProvider";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/sections/SiteFooter";
import { company, FOUNDED_YEAR } from "@/content/company";
import "./globals.css";

/* The design uses exactly two families and five weights. Nothing else loads. */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const SITE_URL = "https://rajaenterprises.example";
const description =
  "Raja Enterprises designs, builds and delivers large-scale event infrastructure across India — German hangers, flooring, staging, stalls, lighting and catering, deployed by an in-house crew.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${company.name} — Large-scale event infrastructure since ${FOUNDED_YEAR}`,
    template: `%s — ${company.name}`,
  },
  description,
  applicationName: company.name,
  keywords: [
    "event infrastructure",
    "German hangers",
    "exhibition stalls",
    "staging contractor",
    "wooden flooring",
    "Bengaluru",
    "Karnataka",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: company.name,
    title: `${company.name} — We build moments.`,
    description,
  },
  twitter: { card: "summary_large_image", title: company.name, description },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "light",
};

/**
 * Structured data. Kept to facts the Figma file actually asserts — no invented
 * address, phone or founder, which is also why there is no `telephone` or
 * `address` property here yet.
 */
const organisationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  description,
  foundingDate: String(FOUNDED_YEAR),
  areaServed: "IN",
  url: SITE_URL,
};

/**
 * Set synchronously in <head> so elements the motion system hides are never
 * painted visible first. If JS is off, or reduced motion is on, the class is
 * never added and every `data-reveal` element stays at its natural opacity —
 * the page is fully readable without GSAP ever loading.
 */
const MOTION_READY = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("motion-ready")}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${poppins.variable} ${robotoMono.variable}`}
      // The inline script below adds `motion-ready` to this element before
      // hydration, which React would otherwise report as an attribute mismatch.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_READY }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SiteNav />
          {children}
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
