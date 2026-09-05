import { Agents } from "@/components/sections/agents";
import { Commands } from "@/components/sections/commands";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Install } from "@/components/sections/install";
import { Model } from "@/components/sections/model";
import { Why } from "@/components/sections/why";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";
import { SectionTracker } from "@/components/site/section-tracker";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Why />
        <Install />
        <Agents />
        <Commands />
        <Model />
        <Faq />
      </main>
      <Footer />
      <SectionTracker />
    </>
  );
}
