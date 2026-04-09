"use client";

import { motion } from "framer-motion";
import { ArrowRight, Crown } from "lucide-react";
import Glassmorphism from "@/components/effects/glassmorphism";
import ScrollReveal from "@/components/effects/scroll-reveal";

export default function CTA() {
  return (
    <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201, 168, 76, 0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto">
        <ScrollReveal>
          <Glassmorphism intensity="medium" className="p-8 sm:p-12 lg:p-16">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-8"
              >
                <Crown className="w-8 h-8 text-accent" />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Build Your{" "}
                <span className="text-gold">Empire</span>
              </h2>

              <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
                Join thousands of investors who trust the AI Council to navigate
                markets with institutional-grade precision. Start free, scale
                when ready.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#pricing"
                  className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 group"
                >
                  Start Free Today
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#features"
                  className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2"
                >
                  Explore Features
                </a>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/30">
                <span>No credit card required</span>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
                <span>Cancel anytime</span>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
                <span>Bank-grade encryption</span>
              </div>
            </div>
          </Glassmorphism>
        </ScrollReveal>
      </div>
    </section>
  );
}
