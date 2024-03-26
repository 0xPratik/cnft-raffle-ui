import { useQuery } from "@tanstack/react-query";
import { getAllUserRaffleAccounts } from "@/lib/program/programFetch";
import { RaffleItem } from "@/types";

export function useUserRaffles() {
  let useAnchorWallet;
  if (typeof window !== "undefined") {
    ({ useAnchorWallet } = require("@jup-ag/wallet-adapter"));
  }
  const wallet = useAnchorWallet();

  const { data, isSuccess, isError, isPending, error, status } = useQuery({
    queryKey: ["userRaffles"],
    queryFn: () => getAllUserRaffleAccounts(wallet),
  });

  let userRaffles: RaffleItem[] = [];
  if (isSuccess && data) {
    userRaffles = data.map((raffle) => ({
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
  }

  return { userRaffles, isSuccess, isError, isPending };
}
