import { AnchorProvider, Idl, IdlTypes, Program } from "@coral-xyz/anchor";
import { CnftRaffle, IDL } from "./program";
import * as anchor from "@coral-xyz/anchor";

export const programID = "71PH4vehb6rbbMJmFFgyP4HL3sF782bUexCjhtHk9fDT";
export const programIDPubkey = new anchor.web3.PublicKey(programID);

export async function degenProgram(provider?: AnchorProvider) {
  const degenProgram = new Program<CnftRaffle>(IDL, programIDPubkey, provider);
  return degenProgram;
}
