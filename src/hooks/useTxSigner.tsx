import { TransactionInstruction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useEffect, useState } from "react";
import { AnchorWallet } from "@jup-ag/wallet-adapter";
import { toast } from "sonner";
import { envClientSchema } from "@/lib/constants";

export function useTxSigner() {
  let useAnchorWallet;
  if (typeof window !== "undefined") {
    ({ useAnchorWallet } = require("@jup-ag/wallet-adapter"));
  }
  const wallet: AnchorWallet = useAnchorWallet();
  const [processing, setProcessing] = useState(false);

  const createTransaction = async (inxs: TransactionInstruction[]) => {
    try {
      const connection = new anchor.web3.Connection(
        envClientSchema.NEXT_PUBLIC_RPC
      );
      const { blockhash } = await connection.getLatestBlockhash();
      const transaction = new anchor.web3.Transaction({
        recentBlockhash: blockhash,
        feePayer: wallet.publicKey,
      });
      console.log("INXS", JSON.stringify(inxs));
      if (!inxs) {
        throw new Error("Failed to create Withdraw Instruction");
      }
      transaction.add(...inxs);

      return transaction;
    } catch (error) {
      console.error("Error creating transaction", error);
      throw error;
    }
  };

  const performTransaction = async (inxs: TransactionInstruction[]) => {
    if (!wallet) {
      throw new Error("Wallet not found!");
    }
    const cluster =
      process.env.NEXT_PUBLIC_ENV === "mainnet-beta" ? "mainnet" : "devnet";

    try {
      setProcessing(true);
      const connection = new anchor.web3.Connection(
        envClientSchema.NEXT_PUBLIC_RPC
      );
      const transactions: anchor.web3.Transaction[] = [];
      console.log("inxs", inxs.length);

      if (inxs.length >= 3) {
        console.log("SLICE", inxs.slice(0, 2));
        let tx = await createTransaction(inxs.slice(0, 2));
        transactions.push(tx);
        console.log("SLICE2", inxs.slice(2));
        let tx2 = await createTransaction(inxs.slice(2));
        transactions.push(tx2);
      } else if (inxs.length < 3) {
        console.log("SINGLE", inxs);
        let tx = await createTransaction(inxs);
        transactions.push(tx);
      }

      if (transactions.length === 0) {
        throw new Error("Failed to create transactions");
      }

      console.log("TXS", transactions.length);
      console.log("TS", JSON.stringify(transactions));
      toast.info("processing Transaction");
      let signedTxs: anchor.web3.Transaction[] = [];
      if (transactions.length > 1) {
        signedTxs = await wallet.signAllTransactions(transactions);
      } else if (transactions.length === 1) {
        signedTxs = [await wallet.signTransaction(transactions[0])];
      }

      for (const signedTx of signedTxs) {
        const sig = await connection.sendRawTransaction(signedTx.serialize(), {
          skipPreflight: true,
        });
        if (!sig) {
          throw new Error("Transaction failed to send");
        }
        console.log("SIGN", sig);
        const res = await connection.confirmTransaction(sig, "confirmed");
        console.log("RES", res.context, res.value.err);
        // toast.success("Transaction Confirmed!");
        toast("Check on Explorer", {
          action: {
            label: "View on Explorer",
            onClick: () =>
              window.open(
                "https://explorer.solana.com/tx/" + sig + `?cluster=${cluster}`,
                "_blank"
              ),
          },
        });
      }

      setProcessing(false);
      return signedTxs;
    } catch (error: any) {
      setProcessing(false);
      console.log("Error performing transaction", error);
      toast.error(error.message);
    }
  };
  return { performTransaction, processing };
}
