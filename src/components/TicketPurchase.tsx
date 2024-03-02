import * as anchor from "@coral-xyz/anchor";

import { CheckCircleIcon, TicketIcon } from "lucide-react";
import { toast } from "sonner";

import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import type { RaffleCardInterface } from "../types";
import { buyTicketIx } from "../lib/program/instructions";
import clsx from "clsx";
import { useState } from "react";
import { useTxSigner } from "@/hooks/useTxSigner";

interface TicketPurchaseProps extends RaffleCardInterface {
  size?: "sm" | "lg";
  onSuccess?: (numTickets: number | null) => void;
}

enum TicketPurchaseStates {
  Default,
  Processing,
  Success,
}

export const TicketPurchase = (props: TicketPurchaseProps) => {
  const [ticketQty, setTicketQty] = useState<number | null>(null);
  const [ticketPurchaseState, setTicketPurchaseState] =
    useState<TicketPurchaseStates>(TicketPurchaseStates.Default);

  const { performTransaction } = useTxSigner();
  let useAnchorWallet;
  if (typeof window !== "undefined") {
    ({ useAnchorWallet } = require("@jup-ag/wallet-adapter"));
  }
  const wallet = useAnchorWallet();

  const shouldDisable =
    wallet?.publicKey === null ||
    wallet?.publicKey === undefined ||
    ticketQty === 0;

  const handleTicketPurchase = async () => {
    try {
      if (!ticketQty) {
        throw new Error("Please enter a valid ticket quantity");
      }

      if (ticketQty === 0) {
        toast.error("Please enter a valid ticket quantity");
        return;
      }
      if (!props.raffle && !props.ticketMint && props.raffle === undefined) {
        toast.error("Please enter a valid raffle");
        return;
      }

      const ix = await buyTicketIx(
        wallet as NodeWallet,
        ticketQty,
        props.price,
        new anchor.web3.PublicKey(props.ticketMint),
        new anchor.web3.PublicKey(props.raffle)
      );

      const sig = await performTransaction(ix);
      console.log("Ticket Purchase", sig);

      const cluster =
        process.env.NEXT_PUBLIC_ENV === "mainnet-beta" ? "mainnet" : "devnet";
    } catch (error: any) {
      console.log("Catched the Error on handler", error);
      toast.error(error.message);
    }

    setTicketPurchaseState(TicketPurchaseStates.Processing);
    setTicketPurchaseState(TicketPurchaseStates.Success);
    setTicketQty(null);
    if (props.onSuccess) {
      props.onSuccess(ticketQty);
    }

    setTicketPurchaseState(TicketPurchaseStates.Default);
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <form
        className={clsx(
          props.ticketsTotal &&
            props.ticketsTotal - props.soldTickets === 0 &&
            "opacity-50 pointer-events-none"
        )}
        onSubmit={(e) => {
          e.preventDefault();
          handleTicketPurchase();
        }}
      >
        <div className="flex rounded-md shadow-sm">
          <div className="relative flex items-stretch flex-grow focus-within:z-10">
            <div
              className={clsx(
                "absolute inset-y-0 left-0 flex items-center pointer-events-none",
                (!props.size || props.size === "sm") && "pl-3",
                props.size && props.size === "lg" && "pl-3.5"
              )}
            >
              <TicketIcon
                className={clsx(
                  "text-gray-400",
                  (!props.size || props.size === "sm") && "w-5 h-5",
                  props.size && props.size === "lg" && "w-6 h-6"
                )}
                aria-hidden="true"
              />
            </div>
            <input
              type="number"
              name="qty"
              id="qty"
              min={0}
              required
              value={ticketQty ? String(ticketQty) : ""}
              className={clsx(
                "block pr-2 text-gray-900 border-0 rounded-none rounded-l-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 leading-6",
                (!props.size || props.size === "sm") &&
                  "w-24 text-sm py-2 pl-10",
                props.size && props.size === "lg" && "w-full text-lg py-3 pl-12"
              )}
              placeholder="Qty"
              onChange={(e) => {
                setTicketQty(Number(e.target.value));
              }}
            />
          </div>
          <button
            type="submit"
            disabled={shouldDisable}
            className={clsx(
              "relative -ml-px inline-flex items-center rounded-r-md py-2 font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
              (!props.size || props.size === "sm") && "text-sm px-3",
              props.size && props.size === "lg" && "text-base px-5",
              shouldDisable && "opacity-20 pointer-events-none"
            )}
          >
            {ticketPurchaseState === TicketPurchaseStates.Default && "Buy"}
            {ticketPurchaseState === TicketPurchaseStates.Processing && (
              <svg
                className="w-5 h-5 mx-[3px] text-indigo-400 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {ticketPurchaseState === TicketPurchaseStates.Success && (
              <CheckCircleIcon className="w-6 h-6 mx-[3px] text-black" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
