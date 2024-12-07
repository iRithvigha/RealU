import React,{useState} from 'react';

import { useSDK } from '@metamask/sdk-react';

const WalletConnect = () => {
  const [account, setAccount] = useState<string | null>(null);
  const { sdk, connected, chainId } = useSDK();

  const connectWallet = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0] || null);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  return (
     <div>
      {connected ? (
        <div>
          <p>Connected account: {account}</p>
          <p>Connected chain ID: {chainId}</p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect to MetaMask</button>
      )}
    </div>
  );
};

export default WalletConnect;
