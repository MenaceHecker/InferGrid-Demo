"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Hero() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left"
    >
      <motion.h1
        variants={item}
        className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50"
      >
        Welcome to InferGrid.
      </motion.h1>
      <motion.p
        variants={item}
        className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400"
      >
        A demo app for exploring InferGrid — built with Next.js, TypeScript,
        Tailwind, Framer Motion, and Zustand.
      </motion.p>
      <motion.div
        variants={item}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <Button asChild size="default" className="h-12 px-6 text-base">
          <Link href="/grid">
            Launch the demo
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="outline" size="default" className="h-12 px-6 text-base">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </Button>
      </motion.div>
    </motion.div>
  );
}
