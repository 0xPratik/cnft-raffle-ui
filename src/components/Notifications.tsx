import {
  IUnifiedWalletConfig,
  IWalletNotification,
} from "@jup-ag/wallet-adapter/dist/types/contexts/WalletConnectionProvider";
import { toast } from "sonner";

const WalletNotification: IUnifiedWalletConfig["notificationCallback"] = {
  onConnect: (props: IWalletNotification) => {
    toast.success(`Connected to wallet ${props.shortAddress}`);
  },
  onConnecting: (props: IWalletNotification) => {
    toast.info(props.walletName);
  },
  onDisconnect: (props: IWalletNotification) => {
    toast.error(`Disconnected from ${props.walletName}`);
  },
  onNotInstalled: (props: IWalletNotification) => {
    toast.error(` ${props.walletName} Wallet is not installed`);
  },
};

export default WalletNotification;
