export const DEVNET_RPC =
  "https://devnet.helius-rpc.com/?api-key=17dfa7d5-4332-45f0-9b37-ad14af2c9782";
export const MAINNET_RPC =
  "https://mainnet.helius-rpc.com/?api-key=370fc1b6-0ee6-4cb6-8100-085827f41067";
export const RPC =
  process.env.NEXT_PUBLIC_ENV === "mainnet-beta" ? MAINNET_RPC : DEVNET_RPC;
