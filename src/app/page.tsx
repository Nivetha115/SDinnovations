import Hero from "@/components/Hero";
import CTA from "@/components/CTA";
import { Work } from "@/components/Sections";
import AboutTurn from "@/components/home/AboutTurn";
import Capabilities from "@/components/home/Capabilities";
import WhyWall from "@/components/home/WhyWall";
import FlowBackground from "@/components/FlowBackground";

// Scroll story inspired by philos.site: one particle sculpture travels through
// hero drift → the turn → the ascent → the wall.
export default function Home() {
  return (
    <main>
      <Hero />
      <AboutTurn />
      <Capabilities />
      <WhyWall />
      <Work />
      <CTA />
      <FlowBackground />
    </main>
  );
}
