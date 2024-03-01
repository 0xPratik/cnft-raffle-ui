/* eslint-disable @next/next/no-img-element */
"use client";

import * as anchor from "@coral-xyz/anchor";
import clsx from "clsx";
import Link from "next/link";
import { RaffleCardInterface, RewardAsset } from "@/types";
import { RaffleTimer } from "./RaffleTimer";
import { TicketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketPurchase } from "./TicketPurchase";
import { useNftDataByMint } from "@/hooks/useNftDataByMint";
import { searchTokenByMintAddress } from "@/lib/tokens";
import { toast } from "sonner";
import {
  claimPrizeIx,
  declareWinnerIx,
  raffleWithdrawIx,
} from "@/lib/program/instructions";
import { RPC } from "@/lib/constants";
import { BitArray } from "@/lib/program/bitArray";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTxSigner } from "@/hooks/useTxSigner";

interface RaffleCardProps extends RaffleCardInterface {
  hideDetails?: boolean;
  link?: boolean;
  size?: "sm" | "lg";
  selectedTokens?: string[];
  onFavorite?: (favorited: boolean) => void;
  isRaffleCreator?: boolean;
  ticketAccount?: any;
  raffleCreator?: string;
}

export function RaffleCard(props: RaffleCardProps) {
  const nftQueries = useNftDataByMint({
    mint: props.assets.map((asset) => asset.reward.toString()),
  });
  const tokenBalances = useTokenBalance(props.treasuryAccount);
  let useAnchorWallet;
  if (typeof window !== "undefined") {
    ({ useAnchorWallet } = require("@jup-ag/wallet-adapter"));
  }
  const wallet = useAnchorWallet();
  const token = searchTokenByMintAddress(props.ticketMint);
  const uiPrice = token ? props.price / 10 ** token.decimals : 0;

  const [isWinner, setIsWinner] = useState<RewardAsset | undefined>();
  const isRaffleEnded = !!props.endDate && new Date() > props.endDate;
  const isWinnersDeclared = props.assets.every((asset) => asset.randomNo > 0);
  const canWithdraw = isRaffleEnded && isWinnersDeclared;
  const { performTransaction } = useTxSigner();

  // console.log("isWinnersDeclared", isWinnersDeclared);
  // console.log("RAFFLECREATOR", props.raffleCreator);

  // console.log("isRaffleCreator", props.isRaffleCreator);

  useEffect(() => {
    if (props.ticketAccount) {
      const bitArray = new BitArray(
        props.ticketAccount?.account?.tickets.amount,
        props.ticketAccount?.account?.tickets.tickets
      );
      const rewards = props.assets;
      const isWinner = rewards.filter((reward) => {
        if (bitArray.checkTicket(reward.randomNo)) {
          return {
            reward,
            randomNo: reward.randomNo,
          };
        }
      });
      if (isWinner.length > 0) setIsWinner(isWinner[0]);
      console.log("isWinner", isWinner);
    }
  }, [props.ticketAccount, props.assets]);

  //TODO: (Pratik) i think a better approach would be to get this passed from the parent component
  const declareWinnerHandler = async () => {
    try {
      // if (canWithdraw) {
      //   toast.error("Can't declare winner yet");
      //   return;
      // }

      const ix = await declareWinnerIx(new anchor.web3.PublicKey(props.raffle));
      await performTransaction([ix]);
    } catch (error: any) {
      toast.error(error.message);
      console.log("Catched the Error on handler declareWinnerHandler", error);
    }
  };

  const claimPrizeHandler = async () => {
    try {
      console.log("claimPrizeHandler");
      if (!props.ticketAccount) {
        return;
      }
      const bitArray = new BitArray(
        props.ticketAccount?.account?.tickets.amount,
        props.ticketAccount?.account?.tickets.tickets
      );
      const rewards = props.assets;
      const isWinner = rewards.filter((reward) => {
        if (bitArray.checkTicket(reward.randomNo)) {
          return {
            reward,
            randomNo: reward.randomNo,
          };
        }
      });
      if (isWinner.length === 0) {
        toast.error("You are not a winner");
        return;
      }
      if (!props.raffleCreator) {
        toast.error("Raffle Creator not found");
        return;
      }
      console.log("CREATING CLAIM INSTRUCTION");
      const ix = await claimPrizeIx(
        wallet,
        new anchor.web3.PublicKey(props.raffle),
        isWinner[0].reward.toString(),
        new anchor.web3.PublicKey(props.raffleCreator)
      );
      await performTransaction([ix]);
    } catch (error: any) {
      toast.error(error.message);
      console.log("Claim Prize Error", error);
    }
  };

  const withdrawAction = async () => {
    try {
      if (!props.ticketMint || !props.raffle) {
        toast.error("Ticket Mint or Raffle Account not found");
        throw new Error("Ticket Mint or Raffle Account not found");
      }
      const ix = await raffleWithdrawIx(
        wallet,
        new anchor.web3.PublicKey(props.ticketMint),
        new anchor.web3.PublicKey(props.raffle)
      );
      await performTransaction([ix]);
    } catch (error: any) {
      console.log("Catched the Error on handler", error);
      toast.error(error.message);
    }
  };

  return (
    <div
      className={clsx(
        "relative text-gray-900 transition bg-white border border-gray-200 rounded-lg shadow",
        (!props.size || props.size === "sm") && "lg:max-w-sm",
        props.size && props.size === "lg" && "lg:max-w-lg"
      )}
    >
      <Carousel>
        <CarouselContent>
          {nftQueries.map((nft, i) => {
            return (
              <CarouselItem key={i}>
                <img
                  className={clsx(
                    "object-cover w-full border-b-2",
                    "max-w-full",
                    "height: auto",

                    props.raffle !== "" && "cursor-pointer",
                    !props.hideDetails && "rounded-t-lg",
                    props.hideDetails && "rounded-lg",
                    (!props.size || props.size === "sm") && "h-80",
                    props.size && props.size === "lg" && "h-[500px]"
                  )}
                  src={nft.data?.content.links.image}
                  alt={nft.data?.content.links.image}
                  loading="lazy"
                />
                {!props.hideDetails && (
                  <div className="flex-col justify-between relative p-4">
                    <header className="mb-2">
                      <h2 className="flex text-2xl font-bold tracking-tight ">
                        <Link href={`/raffle/${props.raffle}`}>
                          {nft.data?.content.metadata.name}
                        </Link>
                      </h2>
                    </header>
                    <ul className="mb-4 text-sm">
                      <li>
                        <strong className="font-semibold">Tickets price</strong>
                        : {uiPrice}{" "}
                        <span className="font-bold">{token?.tokenName}</span>
                      </li>
                      <li>
                        <strong className="font-semibold">
                          Tickets Remaining
                        </strong>
                        : {props.ticketsTotal - props.soldTickets}
                      </li>
                      {props.ticketAccount &&
                        props.ticketAccount.account.tickets.amount > 0 && (
                          <li>
                            <strong className="font-semibold text-indigo-500">
                              Tickets purchased
                            </strong>
                            {/* Need to change this later this is wrong as this value is not being updated based on the user state  */}
                            : {props.ticketAccount.account.tickets.amount}
                          </li>
                        )}
                    </ul>

                    <RaffleTimer {...props} className="mb-3" />

                    {/* <HeartIcon
            className={clsx(
              "absolute w-5 h-5 transition-colors cursor-pointer top-4 right-4 active:animate-ping hover:scale-110",
              !raffleData.favorited && "text-gray-300",
              raffleData.favorited && "text-red-400",
              favoritedAnimation && "animate-ping"
            )}
            onClick={() => handleFavoriteClick()}
          /> */}
                    {props.ticketsPurchased && props.ticketsPurchased > 0 && (
                      <TicketIcon className="absolute w-6 h-6 text-yellow-400 transition-colors top-3.5 right-11" />
                    )}
                    {props.isRaffleCreator ? (
                      <div className="flex flex-col items-center justify-between w-full gap-2">
                        <p className="text-xs font-semibold">
                          Amount to be withdrawn:{" "}
                          {tokenBalances.data?.value.uiAmount}{" "}
                          {token?.tokenName}
                        </p>
                        <button
                          className="flex items-center justify-center w-full h-10 px-6 text-sm font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-zinc-700 hover:bg-zinc-600 focus:shadow-outline focus:outline-none"
                          type="button"
                          // disabled={canWithdraw}
                          onClick={
                            isWinnersDeclared
                              ? withdrawAction
                              : declareWinnerHandler
                          }
                        >
                          {isWinnersDeclared
                            ? canWithdraw
                              ? "Can't withdraw "
                              : `Withdraw`
                            : "Declare Winner"}
                        </button>
                      </div>
                    ) : props.ticketAccount && isWinner !== undefined ? (
                      <div className="flex items-center justify-between w-full gap-2">
                        <Button onClick={claimPrizeHandler} className="w-full">
                          Claim Prize
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full gap-2">
                        <TicketPurchase
                          {...props}
                          onSuccess={(numTickets) => {
                            console.log("success", numTickets);
                            // setRaffleData({
                            //   ...raffleData,
                            //   ticketsPurchased:
                            //     props.ticketsPurchased &&
                            //     props.ticketsPurchased + Number(numTickets),
                            //   soldTickets: props.soldTickets + Number(numTickets),
                            // });
                          }}
                        />
                        <Button asChild>
                          <Link href={`/raffle/${props.raffle}`}>
                            View Raffle
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {nftQueries.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
    </div>
  );
}
