import { AnchorProvider, Idl, IdlTypes, Program } from "@coral-xyz/anchor";
import { CnftRaffle, IDL } from "./program";
import * as anchor from "@coral-xyz/anchor";

export const programID = "21VexLHn3EtK5s67Ws4pDbXLtkQ4afmPjBxFX1ja7gf8";
export const programIDPubkey = new anchor.web3.PublicKey(programID);

export const errorMessages = [
  "Raffle Not Ended",
  "Raffle already ended",
  "Invalid VRF Account",
  "Cannot request Winner Before Time",
  "Not Allowed to Claim Early",
  "Random Account not Selected",
  "Not a Winner",
  "All Tickets Sold",
  "end_date is in past",
  "price cannot be zero",
  "Rewards Cannot be more than 3",
  "All Winner's Declared",
  "Random No Not Found",
  "No Balance",
];

export async function degenProgram(provider?: AnchorProvider) {
  const degenProgram = new Program<CnftRaffle>(IDL, programIDPubkey, provider);
  return degenProgram;
}
