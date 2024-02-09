import { useQuery } from "@tanstack/react-query";
import { getAllTicketsForRaffle } from "@/lib/program/programFetch";
import * as anchor from "@coral-xyz/anchor";

export function useRaffleTicketAccounts(raffle: string) {
  const rafflePubkey = new anchor.web3.PublicKey(raffle);
  const raffleTicketAccounts = useQuery({
    queryKey: ["userTickets"],
    queryFn: () => getAllTicketsForRaffle(rafflePubkey),
  });

  return { ...raffleTicketAccounts };
}
