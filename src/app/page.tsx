import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Testimonials from "@/components/landing/testimonials";
import Pricing from "@/components/landing/pricing";
import CTA from "@/components/landing/cta";
import CursorGlow from "@/components/effects/cursor-glow";
import PageTransition from "@/components/effects/page-transition";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <PageTransition>
        <main className="min-h-screen">
          <Hero />
          <Features />
          <Testimonials />
          <Pricing />
          <CTA />
        </main>
      </PageTransition>
    </>
  );
}
