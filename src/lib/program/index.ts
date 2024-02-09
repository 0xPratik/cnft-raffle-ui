import { AnchorProvider, Idl, IdlTypes, Program } from "@coral-xyz/anchor";
import { Degen, IDL } from "./program";
import * as anchor from "@coral-xyz/anchor";

export const programID = "J4AG4YBe9NNWLpnBg3wVZpBrfiwRj9hDezN4EWLfHKFV";
export const programIDPubkey = new anchor.web3.PublicKey(programID);

export async function degenProgram(provider?: AnchorProvider) {
  const degenProgram = new Program<Degen>(IDL, programIDPubkey, provider);
  return degenProgram;
}
