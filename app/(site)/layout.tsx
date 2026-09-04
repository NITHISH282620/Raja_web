import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Poppins, Roboto_Mono } from "next/font/google";
import { MotionProvider } from "@/motion/MotionProvider";
import { SiteNav } from "@/components/SiteNav";
import { PageTransition } from "@/components/PageTransition";
import { SiteFooter } from "@/sections/SiteFooter";
import { company, FOUNDED_YEAR } from "@/content/company";
import { getContact } from "@/lib/store";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

/* The design uses exactly two families and six weights. Nothing else loads.
   600 is not optional: `font-semibold` sits on every SectionTitle and hero
   headline, and Poppins has no variable cut, so without it the browser
   synthesises the weight or snaps to 700. Playfair Display used to be loaded
   here at four weights and was referenced by nothing at all. */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-roboto-mono",
  display: "swap",
});

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
  themeColor: "#f5f5f7",
  colorScheme: "light",
};

/**
 * Structured data. Kept to facts the Figma file actually asserts — no invented
 * address, phone or founder, which is also why there is no `telephone` or
 * `address` property here yet.
 */
function buildJsonLd(contact: ReturnType<typeof getContact>) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organisation`,
    name: company.name,
    description,
    foundingDate: String(FOUNDED_YEAR),
    areaServed: { "@type": "Country", name: "India" },
    url: SITE_URL,
    ...(contact.email ? { email: contact.email } : {}),
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(contact.addressLines.length
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: contact.addressLines[0],
            addressLocality: company.city,
            addressRegion: "Karnataka",
            addressCountry: "IN",
          },
        }
      : {}),
    knowsAbout: [
      "Event infrastructure",
      "German hangers",
      "Exhibition stall fabrication",
      "Event flooring",
      "Staging",
      "Event scaffolding",
    ],
  };
}

/**
 * Set synchronously in <head> so elements the motion system hides are never
 * painted visible first. If JS is off, or reduced motion is on, the class is
 * never added and every `data-reveal` element stays at its natural opacity —
 * the page is fully readable without GSAP ever loading.
 */
const MOTION_READY = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("motion-ready")}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const contact = getContact();

  return (
    <html
      lang="en-IN"
      className={`${poppins.variable} ${robotoMono.variable}`}
      // The inline script below adds `motion-ready` to this element before
      // hydration, which React would otherwise report as an attribute mismatch.
      suppressHydrationWarning
    >
      <head>
        <Script id="motion-ready" dangerouslySetInnerHTML={{ __html: MOTION_READY }} />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(contact)) }}
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
          <SiteNav contact={contact} />
          <PageTransition>
            {children}
          </PageTransition>
          <SiteFooter contact={contact} />
        </MotionProvider>
      </body>
    </html>
  );
}
