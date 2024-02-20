import { AnchorProvider, Idl, IdlTypes, Program } from "@coral-xyz/anchor";
import { CnftRaffle, IDL } from "./program";
import * as anchor from "@coral-xyz/anchor";

export const programID = "H6UXxuj2kmUn3oWfCBTC9dEvU4STk4hHhTH9vKi3QJAs";
export const programIDPubkey = new anchor.web3.PublicKey(programID);

export async function degenProgram(provider?: AnchorProvider) {
  const degenProgram = new Program<CnftRaffle>(IDL, programIDPubkey, provider);
  return degenProgram;
}
