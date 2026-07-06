import Image from "next/image";

import { ThemeToggle } from "@/components/theme-toggle";
import { Hero } from "./Hero";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col justify-between bg-white px-16 py-24 dark:bg-black">
        <div className="flex items-center justify-between">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <ThemeToggle />
        </div>
        <Hero />
        <div />
      </main>
    </div>
  );
}
