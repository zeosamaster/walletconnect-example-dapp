import React from "react";
import { ConnectorContext, ConnectorContextProvider } from "./context/ConnectorContext";
import { DappContext, DappContextProvider } from "./context/DappContext";

export function Main() {
  const { address, chainId, connecting, connect, disconnect } = React.useContext(ConnectorContext);
  const { testSendTransaction, pending, success, error } = React.useContext(DappContext);

  const status = connecting
    ? "Connecting"
    : pending
    ? "Pending transaction approval"
    : success
    ? "Successfully sent transaction"
    : error
    ? "Failed sending transaction"
    : "";

  return (
    <div style={{ margin: 16 }}>
      {chainId ? (
        <button onClick={disconnect}>Disconnect</button>
      ) : (
        <button onClick={connect}>Connect</button>
      )}
      <p>address: {address}</p>
      <p>chainId: {chainId}</p>
      <br />
      {chainId && address && <button onClick={testSendTransaction}>Test Send transaction</button>}
      <br />
      <p>Current status: {status}</p>
    </div>
  );
}

export function NewApp() {
  return (
    <ConnectorContextProvider>
      <DappContextProvider>
        <Main />
      </DappContextProvider>
    </ConnectorContextProvider>
  );
}
