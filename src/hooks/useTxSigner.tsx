import { TransactionInstruction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useEffect, useState } from "react";
import { RPC } from "@/lib/constants";

export function useTxSigner() {
  let useAnchorWallet;
  if (typeof window !== "undefined") {
    ({ useAnchorWallet } = require("@jup-ag/wallet-adapter"));
  }
  const wallet = useAnchorWallet();

  const performTransaction = async (inxs: TransactionInstruction[]) => {
    if (!wallet) {
      throw new Error("Wallet not found!");
    }

    try {
      const connection = new anchor.web3.Connection(RPC);
      const { blockhash } = await connection.getLatestBlockhash();
      const transaction = new anchor.web3.Transaction({
        recentBlockhash: blockhash,
        feePayer: wallet.publicKey,
      });
      if (!inxs) {
        throw new Error("Failed to create Withdraw Instruction");
      }
      transaction.add(...inxs);
      const signedTx = await wallet.signTransaction(transaction);
      const sig = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: true,
      });
      if (!sig) {
        throw new Error("Transaction failed to send");
      }
      const res = await connection.confirmTransaction(sig, "confirmed");
      console.log("SIGN", sig);
      console.log("RES", res.context, res.value.err);
      //   const errorMsg = getCustomErrorMessage(
      //     errorMessages,
      //     res.value.err
      //   );
      return sig;
    } catch (error) {
      console.log("Error performing transaction", error);
      throw error;
    }
  };
  return performTransaction;
}
