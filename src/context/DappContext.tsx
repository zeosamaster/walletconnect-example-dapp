import React from "react";
import { convertStringToHex } from "src/helpers/bignumber";
import { sanitizeHex } from "src/helpers/utilities";
import { ConnectorContext } from "./ConnectorContext";

interface IDapp {
  testSendTransaction: () => Promise<void>;
  pending: boolean;
  success: object | undefined;
  error: Error | undefined;
}

export const DappContext = React.createContext<IDapp>({
  testSendTransaction: () => Promise.reject(),
  pending: false,
  success: undefined,
  error: undefined,
});

export function DappContextProvider({ children }: React.PropsWithChildren<{}>) {
  const { connector, address, chainId } = React.useContext(ConnectorContext);
  const [pending, setPending] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<object>();
  const [error, setError] = React.useState<Error>();

  const testSendTransaction = React.useCallback(async () => {
    if (!connector || !address || !chainId) {
      return;
    }

    setSuccess(undefined);
    setError(undefined);

    const from = address;
    const to = address;

    // gasLimit
    const _gasLimit = 21000;
    const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

    // value
    const _value = 0;
    const value = sanitizeHex(convertStringToHex(_value));

    // data
    const data = "0x";

    // test transaction
    const tx = {
      from,
      to,
      gasLimit,
      value,
      data,
    };

    try {
      setPending(true);

      // send transaction
      const result = await connector.sendTransaction(tx);

      setPending(false);

      // format displayed result
      const formattedResult = {
        method: "eth_sendTransaction",
        txHash: result,
        from: address,
        to: address,
        value: `${_value} ETH`,
      };

      // display result
      setSuccess(formattedResult);
    } catch (error) {
      setPending(false);
      setError(error);
      console.error(error);
    }
  }, [connector, address, chainId]);

  const value = { testSendTransaction, pending, success, error };

  return <DappContext.Provider value={value}>{children}</DappContext.Provider>;
}
