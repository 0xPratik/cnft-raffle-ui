import z from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_ENV: z
    .enum(["mainnet-beta", "devnet", "testnet"])
    .default("devnet"),
  NEXT_PUBLIC_RPC: z.string(),
});

export const envClientSchema = envSchema.parse({
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  NEXT_PUBLIC_RPC: process.env.NEXT_PUBLIC_RPC,
});
