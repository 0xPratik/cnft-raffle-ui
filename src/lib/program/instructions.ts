import * as anchor from "@coral-xyz/anchor";
import { RPC } from "../constants";
import { degenProgram } from ".";
import { findRafflePDA, findRafflerPDA, findTicketPDA } from "./pdas";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { getAdminPDA, getRaffler } from "./programFetch";

export const declareWinnerIx = async (raffle: anchor.web3.PublicKey) => {
  try {
    anchor.setProvider({
      connection: new anchor.web3.Connection(RPC),
    });
    const provider = anchor.getProvider() as anchor.AnchorProvider;
    const program = await degenProgram(provider);

    const ix = await program.methods
      .declareWinner()
      .accounts({
        raffleAccount: raffle,
        recentSlothashes: anchor.web3.SYSVAR_SLOT_HASHES_PUBKEY,
      })
      .instruction();

    return ix;
  } catch (error) {
    console.log("error declaring ix", error);
    throw new Error(JSON.stringify(error));
  }
};

export const createRafflerIx = async (wallet: anchor.Wallet) => {
  try {
    anchor.setProvider({
      connection: new anchor.web3.Connection(RPC),
    });
    const provider = anchor.getProvider() as anchor.AnchorProvider;
    const program = await degenProgram(provider);

    const [rafflerPDA] = await findRafflerPDA(wallet.publicKey);

    const ix = await program?.methods
      .createRaffler()
      .accounts({
        systemProgram: anchor.web3.SystemProgram.programId,
        authority: wallet.publicKey,
        rafflerAccount: rafflerPDA,
      })
      .instruction();

    console.log("ix", ix);

    return ix;
  } catch (error) {
    console.log("error creating raffler ix", error);
    throw new Error(JSON.stringify(error));
  }
};

export const createRaffleIx = async (
  wallet: anchor.Wallet,
  endDate: anchor.BN,
  ticketPrice: anchor.BN,
  ticketMint: anchor.web3.PublicKey
) => {
  try {
    anchor.setProvider({
      connection: new anchor.web3.Connection(RPC),
    });
    const provider = anchor.getProvider() as anchor.AnchorProvider;
    const program = await degenProgram(provider);
    let idx = 0;

    const adminPDAPubkey = await getAdminPDA();
    const rafflerAccount = await getRaffler(wallet);
    console.log("RAFFLER ACCOUNT", rafflerAccount);

    if (rafflerAccount && rafflerAccount?.noOfRaffles === undefined) {
      throw "Raffler Account not found";
    }
    if (rafflerAccount !== null && rafflerAccount?.noOfRaffles !== undefined) {
      idx = rafflerAccount?.noOfRaffles;
    }

    const [rafflePDAPubkey] = await findRafflePDA(wallet.publicKey, idx);

    const [rafflerPDAPubkey] = await findRafflerPDA(wallet.publicKey);

    let treasury_escrow = await getAssociatedTokenAddress(
      ticketMint, // mint
      rafflePDAPubkey, // owner
      true
    );

    const ix = await program?.methods
      .createRaffle(endDate, ticketPrice)
      .accounts({
        authority: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        adminAccount: adminPDAPubkey,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        raffleAccount: rafflePDAPubkey,
        rafflerAccount: rafflerPDAPubkey,
        raffleTreasuryEscrowAccount: treasury_escrow,
        ticketMint: ticketMint,
      })
      .instruction();

    if (ix === undefined) {
      throw "CreateRaffle ix returns undefined";
    }

    return {
      ixs: ix,
    };
  } catch (error) {
    console.log("Something Went Wrong in creating the Raffle", error);
    throw new Error(JSON.stringify(error));
  }
};

export const addRewardIx = async (
  wallet: anchor.Wallet,
  rewardMint: anchor.web3.PublicKey
) => {
  try {
    anchor.setProvider({
      connection: new anchor.web3.Connection(RPC),
    });
    const provider = anchor.getProvider() as anchor.AnchorProvider;
    const program = await degenProgram(provider);
    let idx = 0;
    const rafflerAccount = await getRaffler(wallet);

    if (rafflerAccount && rafflerAccount?.noOfRaffles === undefined) {
      throw "Raffler Account not found";
    }

    if (rafflerAccount !== null && rafflerAccount?.noOfRaffles !== undefined) {
      idx = rafflerAccount?.noOfRaffles;
    }

    const [rafflePDAPubkey] = await findRafflePDA(wallet.publicKey, idx);

    let walletATA = await getAssociatedTokenAddress(
      rewardMint, // mint
      wallet.publicKey // owner
    );

    let rewardATA = await getAssociatedTokenAddress(
      rewardMint, // mint
      rafflePDAPubkey, // owner
      true
    );

    const ix = await program?.methods
      .addReward()
      .accounts({
        authority: wallet.publicKey,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        nftMint: rewardMint,
        raffleAccount: rafflePDAPubkey,
        authorityTokenAccount: walletATA,
        escrowTokenAccount: rewardATA,
      })
      .instruction();

    return ix;
  } catch (error) {
    console.log("Something Went Wrong in adding the Reward", error);
    throw new Error(JSON.stringify(error));
  }
};

export const buyTicketIx = async (
  wallet: anchor.Wallet,
  noOfTickets: number,
  ticketMint: anchor.web3.PublicKey,
  raffleAccount: anchor.web3.PublicKey
) => {
  try {
    anchor.setProvider({
      connection: new anchor.web3.Connection(RPC),
    });
    const provider = anchor.getProvider() as anchor.AnchorProvider;
    const program = await degenProgram(provider);
    const [ticketPDA] = await findTicketPDA(wallet.publicKey, raffleAccount);
    let treasury_escrow = await getAssociatedTokenAddress(
      ticketMint, // mint
      raffleAccount, // owner
      true
    );
    let buyerAta = await getAssociatedTokenAddress(
      ticketMint, // mint
      wallet.publicKey // owner
    );

    const ix = await program?.methods
      .createTicket(noOfTickets)
      .accounts({
        buyer: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        ticketMint: ticketMint,
        raffleAccount: raffleAccount,
        ticketAccount: ticketPDA,
        treasuryAccount: treasury_escrow,
        buyerTokenAccount: buyerAta,
      })
      .instruction();

    return ix;
  } catch (error) {
    console.log("Something Went Wrong in Buy Ticket", error);
    throw new Error(JSON.stringify(error));
  }
};

export const raffleWithdrawIx = async (
  wallet: anchor.Wallet,
  ticketMint: anchor.web3.PublicKey,
  raffleAccount: anchor.web3.PublicKey
) => {
  anchor.setProvider({
    connection: new anchor.web3.Connection(RPC),
  });
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const program = await degenProgram(provider);
  const adminPDAPubkey = await getAdminPDA();
  const [rafflerPDAPubkey] = await findRafflerPDA(wallet.publicKey);

  const treasuryAccount = new anchor.web3.PublicKey(
    "PitRBc6thx3xkULgMbEiBe1qcCHshcTiMciwrj5wMAY"
  );

  let raffleEscrow = await getAssociatedTokenAddress(
    ticketMint, // mint
    raffleAccount, // owner
    true
  );

  const adminTokenAccount = await getAssociatedTokenAddress(
    ticketMint, // mint
    treasuryAccount // owner
  );

  const rafflerTokenAccount = await getAssociatedTokenAddress(
    ticketMint, // mint
    wallet.publicKey // owner
  );

  const ix = await program?.methods
    .raffleWithdraw()
    .accounts({
      adminAccount: adminPDAPubkey,
      authority: wallet.publicKey,
      ticketMint: ticketMint,
      raffleAccount: raffleAccount,
      rafflerAccount: rafflerPDAPubkey,
      treasuryAccount: raffleEscrow,
      adminTreasuryAccount: treasuryAccount,
      adminTokenAccount: adminTokenAccount,
      rafflerTokenAccount: rafflerTokenAccount,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .instruction();

  return ix;
};

export const claimPrizeIx = async (
  wallet: anchor.Wallet,
  raffleAccount: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  raffleCreator: anchor.web3.PublicKey
) => {
  anchor.setProvider({
    connection: new anchor.web3.Connection(RPC),
  });
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const program = await degenProgram(provider);
  const [rafflerAccount] = await findRafflerPDA(raffleCreator);
  const [ticketPDA] = await findTicketPDA(wallet.publicKey, raffleAccount);

  const claimerTokenAccount = await getAssociatedTokenAddress(
    nftMint, // mint
    wallet.publicKey // owner
  );

  const escrowTokenAccount = await getAssociatedTokenAddress(
    nftMint,
    raffleAccount,
    true
  );

  console.log("escrowTokenAccount", escrowTokenAccount);

  const ix = await program?.methods
    .claimPrize()
    .accounts({
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      authority: wallet.publicKey,
      raffleAccount: raffleAccount,
      nftMint: nftMint,
      ticketAccount: ticketPDA,
      rafflerAccount: rafflerAccount,
      claimerTokenAccount: claimerTokenAccount,
      escrowTokenAccount: escrowTokenAccount,
    })
    .instruction();

  return ix;
};
