import * as anchor from "@coral-xyz/anchor";

import { degenProgram } from ".";
import { findRafflePDA, findRafflerPDA, findTicketPDA } from "./pdas";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
  createInitializeAccountInstruction,
  createSyncNativeInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptAccount,
} from "@solana/spl-token";
import { getAdminPDA, getRaffler } from "./programFetch";
import { getAsset, getAssetProof } from "./ReadApi";
import { decode, mapProof } from "./ReadApi/utils";
import { MPL_BUBBLEGUM_PROGRAM_ID } from "@metaplex-foundation/mpl-bubblegum";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { toWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { envClientSchema } from "../constants";

export const declareWinnerIx = async (raffle: anchor.web3.PublicKey) => {
  try {
    anchor.setProvider({
      connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
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
      connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
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
  maxTickets: anchor.BN,
  ticketMint: anchor.web3.PublicKey
) => {
  try {
    anchor.setProvider({
      connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
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
      .createRaffle(endDate, ticketPrice, maxTickets)
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
      ix,
    };
  } catch (error) {
    console.log("Something Went Wrong in creating the Raffle", error);
    throw new Error(JSON.stringify(error));
  }
};

const getTreeAuthority = (tree: anchor.web3.PublicKey) => {
  const [treeAuthority, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [tree.toBuffer()],
    toWeb3JsPublicKey(MPL_BUBBLEGUM_PROGRAM_ID)
  );

  return treeAuthority;
};

export const addRewardIx = async (
  wallet: anchor.Wallet,
  assetId: string,
  treeAddress: anchor.web3.PublicKey
) => {
  try {
    anchor.setProvider({
      connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
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
    const treeAuthority = getTreeAuthority(treeAddress);
    const [rafflePDAPubkey] = await findRafflePDA(wallet.publicKey, idx);
    const asset = await getAsset(assetId, envClientSchema.NEXT_PUBLIC_RPC);
    console.log("asset", asset);

    const proof = await getAssetProof(assetId, envClientSchema.NEXT_PUBLIC_RPC);
    console.log("proof", proof);
    const root = decode(proof.root);
    const dataHash = decode(asset.compression.data_hash);
    const creatorHash = decode(asset.compression.creator_hash);
    const nonce = new anchor.BN(asset.compression.leaf_id);
    const index = asset.compression.leaf_id;
    const proofPathAsAccounts = mapProof(proof);

    const ix = await program?.methods
      .addReward(root, dataHash, creatorHash, nonce, index)
      .accounts({
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        treeAuthority: treeAuthority,
        merkleTree: treeAddress,
        bubblegumProgram: toWeb3JsPublicKey(MPL_BUBBLEGUM_PROGRAM_ID),
        logWrapper: SPL_NOOP_PROGRAM_ID,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        raffleAccount: rafflePDAPubkey,
      })
      .remainingAccounts(proofPathAsAccounts)
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
  price: number,
  ticketMint: anchor.web3.PublicKey,
  raffleAccount: anchor.web3.PublicKey
) => {
  try {
    console.log("ticketMint", ticketMint.toString(), NATIVE_MINT.toString());

    anchor.setProvider({
      connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
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

    if (ticketMint.toString() === NATIVE_MINT.toString()) {
      console.log("IN HERE NATIVE ");
      console.log("price", price);
      const amount = noOfTickets * price;

      console.log("amountInLamports", amount);
      const nativeIx = anchor.web3.SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: buyerAta,
        lamports:
          amount +
          (await getMinimumBalanceForRentExemptAccount(provider.connection)),
      });
      const createATA = createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        buyerAta,
        wallet.publicKey,
        NATIVE_MINT
      );
      const closeATA = createCloseAccountInstruction(
        buyerAta,
        wallet.publicKey,
        wallet.publicKey
      );
      const sync = createSyncNativeInstruction(buyerAta);
      console.log("SENDING THIS");
      return [createATA, nativeIx, ix, closeATA];
    }
    console.log("RETURNING THIS");
    return [ix];
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
    connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
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
  assetId: string,
  raffleCreator: anchor.web3.PublicKey
) => {
  anchor.setProvider({
    connection: new anchor.web3.Connection(envClientSchema.NEXT_PUBLIC_RPC),
  });
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const program = await degenProgram(provider);
  const [rafflerAccount] = await findRafflerPDA(raffleCreator);
  const [ticketPDA] = await findTicketPDA(wallet.publicKey, raffleAccount);

  const asset = await getAsset(assetId, envClientSchema.NEXT_PUBLIC_RPC);
  const proof = await getAssetProof(assetId, envClientSchema.NEXT_PUBLIC_RPC);
  const root = decode(proof.root);
  const dataHash = decode(asset.compression.data_hash);
  const creatorHash = decode(asset.compression.creator_hash);
  const nonce = new anchor.BN(asset.compression.leaf_id);
  const index = asset.compression.leaf_id;
  const proofPathAsAccounts = mapProof(proof);
  const treeAddress = new anchor.web3.PublicKey(asset.compression.tree);
  console.log("TREE ADDRESS", treeAddress);
  const treeAuthority = getTreeAuthority(treeAddress);
  const ix = await program?.methods
    .claimPrize(root, dataHash, creatorHash, nonce, index)
    .accounts({
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      authority: wallet.publicKey,
      raffleAccount: raffleAccount,
      bubblegumProgram: toWeb3JsPublicKey(MPL_BUBBLEGUM_PROGRAM_ID),
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      ticketAccount: ticketPDA,
      rafflerAccount: rafflerAccount,
      merkleTree: treeAddress,
      treeAuthority: treeAuthority,
    })
    .remainingAccounts(proofPathAsAccounts)
    .instruction();

  return ix;
};
