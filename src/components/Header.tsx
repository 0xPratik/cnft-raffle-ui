"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { WalletConnect } from "./WalletConnect";
import { Suspense } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const LinkWithHoverCard = ({ text }: { text: string }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant={"link"} className="border-b border-transparent">
          {text}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-60">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Connect your Wallet</h4>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export const Header = () => {
  let useAnchorWallet;
  if (typeof window !== "undefined") {
    ({ useAnchorWallet } = require("@jup-ag/wallet-adapter"));
  }
  const wallet = useAnchorWallet();
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between gap-4 p-6 bg-secondary lg:px-8">
      <div className="mr-4">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      {/* <Search
          className={clsx(
            !wallet.connected && 'mx-auto',
            wallet.connected && 'ml-auto mr-4'
          )}
        /> */}

      <nav className="mx-4 text-sm justify-self-end">
        <ul className="flex items-center gap-8">
          <li>
            {wallet?.publicKey ? (
              <Button
                asChild
                variant={"link"}
                className={`${
                  pathname === "/profile"
                    ? "font-semibold border-b-black"
                    : "hover:border-b-black"
                } `}
              >
                <Link href="/profile">My raffles</Link>
              </Button>
            ) : (
              <LinkWithHoverCard text="My raffles" />
            )}
          </li>
          <li>
            {wallet?.publicKey ? (
              <Button
                asChild
                variant={"link"}
                className={`${
                  pathname === "/create"
                    ? "border-b-black font-semibold "
                    : "hover:border-b-black"
                } `}
              >
                <Link href="/create">Create raffle</Link>
              </Button>
            ) : (
              <LinkWithHoverCard text="Create raffle" />
            )}
          </li>
        </ul>
      </nav>

      <WalletConnect />
    </header>
  );
};
