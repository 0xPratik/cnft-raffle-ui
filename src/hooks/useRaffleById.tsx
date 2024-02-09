import { getRaffleFromPDA } from "@/lib/program/programFetch";
import { RaffleItem } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useRaffleById(raffleId: string) {
  const { data, isSuccess, isError, isPending, error, status } = useQuery({
    queryKey: ["RaffleById"],
    queryFn: () => getRaffleFromPDA(raffleId),
  });
  let raffle: RaffleItem | null = null;
  if (isSuccess && data) {
    raffle = {
      raffle: raffleId,
      price: data.price.toNumber(),
      soldTickets: data.soldTickets,
      assets: data.rewards?.filter(
        (reward) =>
          reward.reward.toString() !== "11111111111111111111111111111111"
      ),
      ticketsTotal: 8000,
      endDate: new Date(data.endDate.toNumber() * 1000),
      ticketMint: data.ticketMint?.toString(),
      treasuryAccount: data.treasuryAccount?.toString(),
    };
  }
  return { raffle, isSuccess, isError, isPending };
}
