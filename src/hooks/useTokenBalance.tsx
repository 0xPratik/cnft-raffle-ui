import { RPC } from "@/lib/constants";
import * as anchor from "@coral-xyz/anchor";
import { useQuery } from "@tanstack/react-query";

export const useTokenBalance = (tokenAccount: string) => {
  const res = useQuery({
    queryKey: ["tokenBalance"],
    queryFn: () => getTokenBalance(tokenAccount),
  });

  return { ...res };
};

export const getTokenBalance = async (tokenAccount: string) => {
  try {
    const connection = new anchor.web3.Connection(RPC);
    const tokenAccountPubkey = new anchor.web3.PublicKey(tokenAccount);
    const tokenAccountBalances = await connection.getTokenAccountBalance(
      tokenAccountPubkey
    );

    return tokenAccountBalances;
  } catch (error) {
    console.log("Get Token Balance Error", error);
  }
};
