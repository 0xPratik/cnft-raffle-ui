import { useQueries } from "@tanstack/react-query";
import { RPC } from "@/lib/constants";
import axios from "axios";
import { GetAssetType } from "@/types";

type UseNftDataByMintParams = {
  mint: string[];
};

export function useNftDataByMint({ mint }: UseNftDataByMintParams) {
  const nftQueries = useQueries({
    queries: mint.map((mintAddress) => {
      return {
        queryKey: [`nftDataByMint ${mintAddress}`],
        queryFn: () => getNftFromMint(mintAddress),
      };
    }),
  });

  return nftQueries;
}

export const getNftFromMint = async (mint: string) => {
  try {
    const res = await axios.post(RPC, {
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAsset",
      params: {
        id: mint,
      },
    });
    const response: GetAssetType = res.data;
    return response.result;
  } catch (error) {
    console.log("Nft metadata error", error);
  }
};
