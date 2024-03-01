"use client";

import { RaffleCard } from "@/components/RaffleCard";
import { RaffleCardSkeleton } from "@/components/RaffleCardSkeleton";
import { useUserRaffles } from "@/hooks/useUserRaffles";
import { useUserTicketAccounts } from "@/hooks/useUserTicketAccounts";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: userTicketAccount, isLoading: userTicketAccountLoading } =
    useUserTicketAccounts();
  const { userRaffles, isPending } = useUserRaffles();

  console.log("ticketAccountData?.raffle", userTicketAccount);

  return (
    <div className="flex flex-col w-full h-full mb-5">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold  tracking-tight transition-colors ">
        Your Raffles
      </h2>
      {userRaffles && userRaffles.length !== 0 ? (
        <div className="grid mt-4 w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {userRaffles.map((raffle) => (
            <RaffleCard
              key={raffle.raffle}
              {...raffle}
              isRaffleCreator={true}
            />
          ))}
        </div>
      ) : isPending ? (
        <div className="grid mt-4 w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <RaffleCardSkeleton />
          <RaffleCardSkeleton />
          <RaffleCardSkeleton />
          <RaffleCardSkeleton />
        </div>
      ) : (
        <p className="leading-7 [&:not(:first-child)]:mt-6  text-yellow-800">
          You have no raffles yet. Go to the{" "}
          <Link className="text-red-500" href="/">
            Home page
          </Link>{" "}
          to buy some tickets!
        </p>
      )}
      {userTicketAccount && userTicketAccount.length !== 0 && (
        <>
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Your Tickets
          </h2>
          {userTicketAccountLoading && (
            <div className="mt-4 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <RaffleCardSkeleton />
              <RaffleCardSkeleton />
              <RaffleCardSkeleton />
              <RaffleCardSkeleton />
            </div>
          )}
          {userTicketAccount.length !== 0 && (
            <div className="mt-4 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {userTicketAccount.map(
                (ticketAccountData) =>
                  ticketAccountData?.raffle && (
                    <RaffleCard
                      key={ticketAccountData.raffle.raffle}
                      {...ticketAccountData?.raffle}
                      ticketAccount={ticketAccountData.ticket}
                    />
                  )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
