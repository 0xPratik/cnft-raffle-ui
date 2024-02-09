"use client";
import { RaffleCard } from "@/components/RaffleCard";
import { RaffleCardSkeleton } from "@/components/RaffleCardSkeleton";
import { useRaffleListing } from "@/hooks/useRaffleListing";

export default function Home() {
  const { raffleListings, isError, isPending, isSuccess } = useRaffleListing();
  console.log(raffleListings);

  console.log("Fetch pending", isPending);

  if (isPending && raffleListings.length === 0) {
    return (
      <main className="w-full px-4 my-8 overflow-x-hidden">
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <RaffleCardSkeleton />
          <RaffleCardSkeleton />
          <RaffleCardSkeleton />
          <RaffleCardSkeleton />
        </div>
      </main>
    );
  }

  if (isSuccess && raffleListings.length !== 0) {
    return (
      <main className="w-full px-4 my-8 overflow-x-hidden">
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {raffleListings.map((raffle) => {
            return <RaffleCard key={raffle.raffle} {...raffle} />;
          })}
        </div>
      </main>
    );
  }
}
