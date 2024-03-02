import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { Item, NFTResponse } from "@/types";
import { envClientSchema } from "@/lib/constants";

export function useNftDataByOwner() {
  let useAnchorWallet;
  if (typeof window !== "undefined") {
    ({ useAnchorWallet } = require("@jup-ag/wallet-adapter"));
  }
  const wallet = useAnchorWallet();
  const walletAddress = wallet?.publicKey.toString();
  const { data, isSuccess, isError, isPending, error, status } = useQuery({
    queryKey: [`nftDataByOwner ${walletAddress}`],
    queryFn: () => getNftDataByOwner(walletAddress),
  });

  return { data, isSuccess, isError, isPending, error, status };
}

async function getNftDataByOwner(walletAddress: string | undefined) {
  if (!walletAddress) {
    throw new Error("Wallet address is required to fetch data");
  }

  try {
    const res = await axios.post(envClientSchema.NEXT_PUBLIC_RPC, {
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAssetsByOwner",
      params: {
        ownerAddress: `${walletAddress}`,
        page: 1,
        limit: 100,
      },
    });

    const data = res.data as NFTResponse;
    const dataWithoutcnfts = data.result.items.filter(
      (item) =>
        item.compression.compressed === false &&
        item.ownership.frozen === false &&
        item.ownership.delegated === false
    );

    return dataWithoutcnfts as Item[];
  } catch (error) {
    throw new Error("Something went wrong with NFT fetch request");
  }
}
