import * as anchor from "@coral-xyz/anchor";
import {
  findAdminPDA,
  findRafflePDA,
  findRafflerPDA,
  findTicketPDA,
} from "./pdas";
import { degenProgram } from ".";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { envClientSchema } from "../constants";

export const getRaffleFromPDA = async (rafflePDA: string) => {
  anchor.setProvider({
    connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
  });
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const program = await degenProgram(provider);
  const rafflePDAPubkey = new anchor.web3.PublicKey(rafflePDA);
  const raffleAccount = await program?.account.raffle.fetchNullable(
    rafflePDAPubkey
  );

  if (!raffleAccount) {
    throw new Error("Raffle account not found");
  }

  return { ...raffleAccount, raffle: rafflePDAPubkey };
};

export const getRaffler = async (wallet: anchor.Wallet) => {
  anchor.setProvider({
    connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
  });
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const [rafflerPDA] = await findRafflerPDA(wallet.publicKey);
  const program = await degenProgram(provider);
  const raffleAccount = await program?.account.raffler.fetchNullable(
    rafflerPDA
  );

  return raffleAccount;
};

export const getRaffle = async (wallet: anchor.Wallet, idx: number) => {
  anchor.setProvider({
    connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
  });
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const [rafflePDA] = await findRafflePDA(wallet.publicKey, idx);
  const program = await degenProgram(provider);
  const raffleAccount = await program?.account.raffle.fetchNullable(rafflePDA);
  return raffleAccount;
};

export const getAllTicketsForRaffle = async (raffle: anchor.web3.PublicKey) => {
  anchor.setProvider({
    connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
  });
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const program = await degenProgram(provider);

  if (!raffle) {
    return undefined;
  }
  const data = await program?.account?.ticket.all([
    {
      memcmp: {
        offset: 8 + 32,
        bytes: raffle.toBase58(),
      },
    },
  ]);

  console.log("IX data", JSON.stringify(data));

  return data;
};

export const getAllRaffleAccounts = async () => {
  anchor.setProvider({
    connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
  });
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const program = await degenProgram(provider);
  const data = await program?.account.raffle.all();
  return data;
};

export const getAllUserRaffleAccounts = async (wallet: anchor.Wallet) => {
  const { publicKey } = wallet;

  if (!publicKey) {
    throw new Error("Wallet public key is not available");
  }

  try {
    anchor.setProvider({
      connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
    });
    const provider = anchor.getProvider() as anchor.AnchorProvider;
    const program = await degenProgram(provider);
    const data = await program?.account.raffle.all([
      {
        memcmp: {
          offset: 8,
          bytes: publicKey.toBase58(),
        },
      },
    ]);
    return data;
  } catch (error) {
    console.error("Error fetching raffle accounts:", error);
    throw error;
  }
};

export const getAllTicketAccounts = async () => {
  anchor.setProvider({
    connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
  });
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const program = await degenProgram(provider);
  const data = await program?.account.ticket.all();
  return data;
};

export const getAllTicketsForUser = async (wallet: anchor.Wallet) => {
  const { publicKey } = wallet;

  if (!publicKey) {
    throw new Error("Wallet public key is not available");
  }

  try {
    anchor.setProvider({
      connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
    });
    const provider = anchor.getProvider() as anchor.AnchorProvider;
    const program = await degenProgram(provider);
    const data = await program?.account.ticket.all([
      {
        memcmp: {
          offset: 8,
          bytes: publicKey.toBase58(),
        },
      },
    ]);
    return data;
  } catch (error) {
    console.error("Error fetching ticket accounts:", error);
    throw error;
  }
};

export const getTicket = async (
  wallet: anchor.Wallet,
  raffleAccount: anchor.web3.PublicKey
) => {
  const [ticketPDA] = await findTicketPDA(wallet.publicKey, raffleAccount);
  anchor.setProvider({
    connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
  });
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const program = await degenProgram(provider);
  const ticketAccount = await program?.account.ticket.fetchNullable(ticketPDA);
  return ticketAccount;
};

export const getAdminPDA = async () => {
  const [adminPDA] = await findAdminPDA();
  return adminPDA;
};
