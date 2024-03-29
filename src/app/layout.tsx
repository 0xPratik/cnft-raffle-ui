import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Client } from "@/DefaultLayout";

export const metadata: Metadata = {
  title: "Degen Raffle",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased`}>
        <Client>{children}</Client>
      </body>
    </html>
  );
}
