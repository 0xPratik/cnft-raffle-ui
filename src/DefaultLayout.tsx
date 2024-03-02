"use client";

import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { Footer } from "./components/ui/Footer";
import { Providers } from "./app/providers/Providers";

export function Client({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen ">
      <Providers>
        <div className="flex flex-col w-full min-h-full">
          <Header />
          <div className="w-full h-full  pt-8 pb-12 mx-auto lg:container">
            {children}
          </div>
          <Footer />
        </div>
        <Toaster position="bottom-left" richColors />
      </Providers>
    </div>
  );
}
