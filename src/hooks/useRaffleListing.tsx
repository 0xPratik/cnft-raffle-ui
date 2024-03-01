import { getAllRaffleAccounts } from "@/lib/program/programFetch";
import { RaffleItem } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useRaffleListing() {
  const { data, isSuccess, isError, isPending, error, status } = useQuery({
    queryKey: ["raffleListing"],
    queryFn: getAllRaffleAccounts,
  });
  let raffleListings: RaffleItem[] = [];
  if (isSuccess && data) {
    raffleListings = data.map((raffle) => ({
      raffle: raffle.publicKey.toString(),
      price: raffle.account.price.toNumber(),
      soldTickets: raffle.account.soldTickets,
      assets: raffle.account.rewards.filter(
        (reward) =>
          reward.reward.toString() !== "11111111111111111111111111111111"
      ),
      ticketsTotal: raffle.account.maxTickets,
      endDate: new Date(raffle.account.endDate.toNumber() * 1000),
      ticketMint: raffle.account.ticketMint.toString(),
      treasuryAccount: raffle.account.treasuryAccount.toString(),
    }));
    raffleListings.sort((a, b) => {
      if (a.endDate && b.endDate) {
        return b.endDate.getTime() - a.endDate.getTime();
      } else {
        return 0;
      }
    });
  }

  return { raffleListings, isSuccess, isError, isPending };
}
