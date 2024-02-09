import { getRaffler } from "@/lib/program/programFetch";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { useEffect, useState } from "react";

export const useCheckIsRaffler = (): any | null => {
  const [rafflerAccount, setRafflerAccount] = useState<any>(null);
  let useAnchorWallet;
  if (typeof window !== "undefined") {
    ({ useAnchorWallet } = require("@jup-ag/wallet-adapter"));
  }
  const wallet = useAnchorWallet();

  useEffect(() => {
    const getRafflerAccount = async () => {
      if (!wallet) return;

      const rafflerAccount = await getRaffler(wallet as NodeWallet);
      // console.log("THE RAFFLER ACCOUNT IS", rafflerAccount);
      if (!rafflerAccount) return;
      setRafflerAccount(rafflerAccount);
    };
    getRafflerAccount();
  }, [wallet]);

  return rafflerAccount;
};
