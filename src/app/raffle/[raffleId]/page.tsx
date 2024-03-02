/* eslint-disable @next/next/no-img-element */
"use client";
import { useRaffleById } from "@/hooks/useRaffleById";
import { useNftDataByMint } from "@/hooks/useNftDataByMint";
import { useState } from "react";

import clsx from "clsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchTokenByMintAddress } from "@/lib/tokens";
import { Skeleton } from "@/components/ui/skeleton";
import { TicketPurchase } from "@/components/TicketPurchase";
import { useRaffleTicketAccounts } from "@/hooks/useRaffleTicketAccounts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import React from "react";
export default function Page({ params }: { params: { raffleId: string } }) {
  const { raffle, isSuccess, isError, isPending } = useRaffleById(
    params.raffleId
  );
  const token = searchTokenByMintAddress(raffle?.ticketMint || "");
  const uiPrice =
    token && raffle?.price ? raffle?.price / 10 ** token.decimals : 0;
  const [activeIdx, setActiveIdx] = useState(0);
  const nftQueries = useNftDataByMint({
    mint: raffle?.assets.map((asset) => asset.reward.toString()) || [],
  });
  const { data: raffleTicketAccounts } = useRaffleTicketAccounts(
    params.raffleId
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  console.log("current", current);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  // console.log("raffle", raffle);
  // console.log("nftQueries", nftQueries);
  return (
    <div className="w-full px-4 my-8">
      <div className="flex flex-col w-full  max-w-lg gap-14 mx-auto mt-16 text-gray-600 lg:flex-row lg:max-w-none lg:justify-between">
        <div className="lg:max-w-[500px]">
          <Carousel setApi={setApi}>
            <CarouselContent>
              {nftQueries.map((nft) => {
                console.log("nft", nft.isLoading, nft.data);
                if (nft.isLoading && nft.data === undefined && isPending)
                  return (
                    <div className="w-full rounded-lg border border-gray-200 shadow">
                      <Skeleton
                        className={clsx(
                          "object-cover w-full",
                          "max-w-full",
                          "height: auto",
                          "lg"
                        )}
                      />
                    </div>
                  );
                return (
                  <CarouselItem key={nft.data?.id}>
                    <img
                      className={clsx(
                        "object-cover w-full",
                        "max-w-full",
                        "height: auto",
                        "lg"
                      )}
                      src={
                        nft.data?.content.links.image || "/img/placeholder.png"
                      }
                      //TODO: change this later to something meaningfull
                      alt={
                        nft.data?.content.links.image || "/img/placeholder.png"
                      }
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className=" w-full ml-8 ">
          <h1 className="flex mb-6 text-4xl font-bold tracking-tight">
            {nftQueries[current - 1]?.data?.content?.metadata?.name || ""}
          </h1>
          <div className="mt-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="tickets">Tickets Bought</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <ul className="mb-6 text-sm">
                  <li>
                    <strong className="font-semibold">Tickets price</strong>:{" "}
                    {uiPrice}{" "}
                    <span className="font-bold">{token?.tokenName}</span>
                  </li>
                  <li>
                    <strong className="font-semibold">Tickets Sold</strong>:{" "}
                    {raffle?.soldTickets}/{raffle?.ticketsTotal}
                  </li>
                </ul>
                <div className="mt-4">
                  {raffle && <TicketPurchase size="lg" {...raffle} />}
                </div>
              </TabsContent>
              <TabsContent value="tickets">
                <div className="mt-4 w-full overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="m-0 border-t p-0 even:bg-muted">
                        <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                          Address
                        </th>
                        <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {raffleTicketAccounts &&
                        raffleTicketAccounts.map((ticket) => {
                          return (
                            <tr
                              key={ticket?.account?.authority.toString() || "e"}
                              className="m-0 border-t p-0 even:bg-muted"
                            >
                              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                {ticket.account?.authority?.toString()}
                              </td>
                              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                {ticket.account?.tickets?.amount}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
