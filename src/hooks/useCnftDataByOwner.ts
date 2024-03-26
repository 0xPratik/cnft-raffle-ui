import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { Item, NFTResponse } from "@/types";
import { envClientSchema } from "@/lib/constants";

const verifiedCollections = [
  "DRiP2Pn2K6fuMLKQmt5rZWyHiUZ6WK3GChEySUpHSS4x",
  "DGPTxgKaBPJv3Ng7dc9AFDpX6E7kgUMZEgyTm3VGWPW6",
  "DPNTcMcvRs4XJVgKzKBqS3Tg6tRbEWyqJ6jgef5HkBxC",
  "DAA1jBEYj2w4DgMRDVaXg5CWfjmTry5t8VEvLJQ9R8PY",
  "DRDRb6qsokfYm6VDGRzqsiyLRFq1Ge2jMSN6BD8tu2Js",
  "5mZC22cd88VDpRUAPs1BFZ21Q1g9zG3LR2JPs1AAaNZQ",
  "HVA9YquXsrhWVFBie1pWzWd5FCD7Td6K536yZrNZx3y",
  "CDm8nCyPCqCpD7XxWwt7iUHH6N88aFTjPADRazZ6zBA2",
  "7soPY36PaM8Ck1EycPq5WJ3CVHjZK47aneFniK5GNFyQ",
  "6BCofUHZbggNRoVLSRU4Yogswhxg9DoyEZRGrUjyfY3j",
];

export function useCnftDataByOwner() {
  let useAnchorWallet;
  if (typeof window !== "undefined") {
    ({ useAnchorWallet } = require("@jup-ag/wallet-adapter"));
  }
  const wallet = useAnchorWallet();
  const walletAddress = wallet?.publicKey.toString();
  const { data, isSuccess, isError, isPending, error, status } = useQuery({
    queryKey: [`nftDataByOwner ${walletAddress}`],
    queryFn: () => getCnftDataByOwner(walletAddress),
  });

  return { data, isSuccess, isError, isPending, error, status };
}

async function getCnftDataByOwner(walletAddress: string | undefined) {
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
    const dataWithCnfts = data.result.items.filter(
      (item) =>
        item.compression.compressed === true &&
        item.ownership.frozen === false &&
        item.ownership.delegated === false
    );
    console.log("dataWithCnfts", dataWithCnfts);
    const verifiedCollectionCnfts = dataWithCnfts.filter((item) => {
      console.log("metadata", item.content.metadata.name);

      return item.grouping.find(
        (group) =>
          group.group_key === "collection" &&
          verifiedCollections.includes(group.group_value)
      );
    });
    // console.log("verifiedCollectionCnfts", verifiedCollectionCnfts);
    verifiedCollectionCnfts.forEach((item) => {
      console.log("verifiedItems", item.content.metadata.name);
    });
    if (envClientSchema.NEXT_PUBLIC_ENV === "mainnet-beta") {
      return verifiedCollectionCnfts as Item[];
    }
    return dataWithCnfts as Item[];
  } catch (error) {
    throw new Error("Something went wrong with NFT fetch request");
  }
}
