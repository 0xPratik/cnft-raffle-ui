"use client";

import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { Footer } from "./components/ui/Footer";
import { Providers } from "./app/providers/Providers";

export function Client({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen ">
      <Providers>
        <div className="flex-col">
          <Header />
          <div className="lg:container">{children}</div>
          <Footer />
        </div>
        <Toaster position="bottom-left" richColors />
      </Providers>
    </div>
  );
}
