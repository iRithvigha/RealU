import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@mysten/dapp-kit/dist/index.css';

import { MetaMaskProvider } from '@metamask/sdk-react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MetaMaskProvider
      sdkOptions={{
        dappMetadata: {
          name: 'Your DApp Name',
          url: window.location.href,
        },
      }}
    >
   <App/>
   </MetaMaskProvider>

  </StrictMode>
);
