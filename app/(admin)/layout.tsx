import type { Metadata } from "next";
import { Poppins, Roboto_Mono } from "next/font/google";
import "../globals.css";
import "./admin.css";

/**
 * The admin root layout.
 *
 * A second root layout, not a nested one: the admin shares the site's design
 * tokens and typography but none of its chrome — no fixed nav, no footer
 * wordmark, and critically no MotionProvider. GSAP's scroll machinery exists to
 * choreograph a marketing page; in a content editor it is weight on every
 * keystroke and a source of layout measurement that fights form controls.
 *
 * Playfair is not loaded here either. The admin is an instrument, so it is set
 * entirely in Poppins and Roboto Mono.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Raja Admin", template: "%s — Raja Admin" },
  // The editor must never be indexed, and it must never be indexed by accident,
  // so this is asserted here rather than inherited from anywhere.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${poppins.variable} ${robotoMono.variable}`}>
      <body className="admin-body antialiased">{children}</body>
    </html>
  );
}
