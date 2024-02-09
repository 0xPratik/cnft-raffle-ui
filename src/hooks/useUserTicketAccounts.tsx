import { useQuery } from "@tanstack/react-query";
import {
  getAllTicketAccounts,
  getAllTicketsForUser,
  getRaffleFromPDA,
} from "@/lib/program/programFetch";
import { Wallet } from "@coral-xyz/anchor";
import { RaffleItem } from "@/types";
import { useRouter } from "next/navigation";

const getRaffleFromTicketAccounts = async (wallet: Wallet) => {
  const ticketAccounts = await getAllTicketsForUser(wallet);
  const raffleIds = ticketAccounts?.map((ticket) =>
    ticket.account.raffle.toString()
  );
  const raffles = await Promise.all(
    raffleIds.map((raffleId) => getRaffleFromPDA(raffleId))
  );

  const ticketRaffles = raffles
    .map((raffle) =>
      raffle
        ? {
            raffleCreator: raffle.authority.toString(),
            raffle: raffle.raffle.toString(),
            price: raffle.price.toNumber(),
            soldTickets: raffle.soldTickets,
            assets: raffle.rewards.filter(
              (reward) =>
                reward.reward.toString() !== "11111111111111111111111111111111"
            ),
            ticketsTotal: 8000,
            endDate: new Date(raffle.endDate.toNumber() * 1000),
            ticketMint: raffle.ticketMint.toString(),
            treasuryAccount: raffle.treasuryAccount.toString(),
          }
        : null
    )
    .filter(Boolean);

  const ticketAndRaffleData = ticketRaffles
    .map((raffle) => {
      if (raffle) {
        const ticket = ticketAccounts?.find(
          (ticket) => ticket.account.raffle.toString() === raffle.raffle
        );
        return { raffle, ticket };
      }
      return null;
    })
    .filter(Boolean);

  return ticketAndRaffleData;
};

export function useUserTicketAccounts() {
  let useAnchorWallet;
  const router = useRouter();
  if (typeof window !== "undefined") {
    ({ useAnchorWallet } = require("@jup-ag/wallet-adapter"));
  }
  const wallet = useAnchorWallet();

  if (!wallet?.publicKey) {
    router.push("/");
  }

  const userTicketAccounts = useQuery({
    queryKey: ["userTickets"],
    queryFn: () => getRaffleFromTicketAccounts(wallet),
  });

  return { ...userTicketAccounts };
}
