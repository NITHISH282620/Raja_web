import { Hero } from "@/sections/Hero";
import { Legacy } from "@/sections/Legacy";
import { Capabilities } from "@/sections/Capabilities";
import { Resources } from "@/sections/Resources";
import { Works } from "@/sections/Works";
import { Process } from "@/sections/Process";
import { Inventory } from "@/sections/Inventory";
import { Clients } from "@/sections/Clients";
import { SiteFooter } from "@/sections/SiteFooter";

/**
 * The nine sections of the Figma `main` frame, in artboard order.
 *
 * Sections own their own markup, content and motion. Nothing is orchestrated
 * from here on purpose — the 19s Figma cohort is decomposed into nine local
 * timelines so any one of them can be retimed or removed in isolation.
 */
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Legacy />
      <Capabilities />
      <Resources />
      <Works />
      <Process />
      <Inventory />
      <Clients />
      <SiteFooter />
    </main>
  );
}
