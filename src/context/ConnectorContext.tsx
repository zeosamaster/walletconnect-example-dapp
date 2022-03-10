import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import React from "react";

interface IType {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  connector: WalletConnect | undefined;
  accounts: string[] | undefined;
  chainId: string | undefined;
  address: string | undefined;
  connecting: boolean;
}

export const ConnectorContext = React.createContext<IType>({
  connect: () => Promise.resolve(),
  disconnect: () => Promise.resolve(),
  connector: undefined,
  accounts: undefined,
  chainId: undefined,
  address: undefined,
  connecting: true,
});

export function ConnectorContextProvider({ children }: React.PropsWithChildren<{}>) {
  const [connector, setConnector] = React.useState<WalletConnect>();
  const [accounts, setAccounts] = React.useState<string[]>();
  const [chainId, setChainId] = React.useState<string>();
  const [connecting, setConnecting] = React.useState<boolean>(false);

  const onSessionUpdate = ({ chainId, accounts }: any) => {
    setConnecting(false);
    setAccounts(accounts);
    setChainId(chainId);
  };

  const onSessionDisconnect = () => {
    onSessionUpdate({ accounts: undefined, chainId: undefined });
  };

  const connect = async () => {
    setConnecting(true);

    const bridge = "https://bridge.walletconnect.org";
    const qrcodeModal = QRCodeModal;

    const connector = new WalletConnect({ bridge, qrcodeModal });
    setConnector(connector);

    if (!connector.connected) {
      await connector.createSession();
    }
  };

  const disconnect = React.useCallback(async () => {
    if (connector) {
      await connector.killSession();
    }
    onSessionDisconnect();
  }, [connector]);

  const subscribeToEvents = React.useCallback(() => {
    if (!connector) {
      return;
    }

    const updateState = (error: any, payload: any) => {
      onSessionUpdate(payload.params[0]);
    };

    connector.on("session_update", updateState);
    connector.on("connect", updateState);
    connector.on("disconnect", onSessionDisconnect);

    if (connector.connected) {
      onSessionUpdate(connector);
    }
  }, [connector]);

  React.useEffect(() => {
    subscribeToEvents();
  }, [subscribeToEvents]);

  const value: IType = {
    connect,
    disconnect,
    connector,
    accounts,
    chainId,
    address: accounts ? accounts[0] : undefined,
    connecting,
  };

  return <ConnectorContext.Provider value={value}>{children}</ConnectorContext.Provider>;
}
