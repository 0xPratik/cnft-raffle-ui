"use client";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";
import { EnvCluster } from "@/types";

const UnifiedWalletProvider = dynamic(
  async () => (await import("@jup-ag/wallet-adapter")).UnifiedWalletProvider,
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  const env: EnvCluster = ["devnet", "testnet", "mainnet-beta"].includes(
    process.env.NEXT_PUBLIC_ENV as EnvCluster
  )
    ? (process.env.NEXT_PUBLIC_ENV as EnvCluster)
    : "devnet";

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      })
  );
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <UnifiedWalletProvider
        wallets={[]}
        config={{
          autoConnect: false,
          env: env,
          metadata: {
            name: "Degen Raffle",
            description: "Raffle for Degens",
            url: "https://jup.ag",
            iconUrls: ["https://jup.ag/favicon.ico"],
          },
          // implement wallet notifications later with sooner
          // notificationCallback: ,
          walletlistExplanation: {
            href: "https://station.jup.ag/docs/additional-topics/wallet-list",
          },
          theme: "jupiter",
          lang: "en",
        }}
      >
        <QueryClientProvider client={queryClient}>
          <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
          {/* {<ReactQueryDevtools initialIsOpen={false} />} */}
        </QueryClientProvider>
      </UnifiedWalletProvider>
    </ThemeProvider>
  );
}
