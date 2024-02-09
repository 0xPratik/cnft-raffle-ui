import * as anchor from "@coral-xyz/anchor";
import { programIDPubkey } from ".";

export const findAdminPDA = async () => {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("admin")],
      programIDPubkey
    );
  };


  export const findRafflerPDA = async (wallet: anchor.web3.PublicKey) => {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("raffler"), wallet.toBuffer()],
      programIDPubkey
    );
  };


  export const findRafflePDA = async (
    wallet: anchor.web3.PublicKey,
    idx: number
  ) => {
    const idxBN = new anchor.BN(idx);
    const byteArray = idxBN.toArray("le", 1);
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("raffle"), wallet.toBuffer(), Buffer.from(byteArray)],
      programIDPubkey
    );
  };

  export const findTicketPDA = async (
    buyerWallet: anchor.web3.PublicKey,
    raffleAccount: anchor.web3.PublicKey
  ) => {
    return await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("ticket"), buyerWallet.toBuffer(), raffleAccount.toBuffer()],
      programIDPubkey
    );
  };