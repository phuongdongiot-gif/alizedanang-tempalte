"use client";

import React, { ReactNode } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { polygonAmoy, polygon, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Setup queryClient
const queryClient = new QueryClient();

// Get projectId from WalletConnect Cloud (https://cloud.walletconnect.com)
// Using a placeholder for this demo implementation
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'c3b5bb2be736b43ffb4334fdb3c07659';

// Create wagmiConfig
const metadata = {
  name: 'Alize Da Nang Web3',
  description: 'Alize Da Nang Real Estate Tokenization Platform',
  url: 'https://alizedanang.net',
  icons: ['https://alizedanang.net/logo.png']
};

const chains = [polygonAmoy, polygon, mainnet] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  auth: {
    email: true,
    socials: ['google', 'x', 'github', 'discord', 'apple'],
    showWallets: true,
    walletFeatures: true
  }
});

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeVariables: {
    '--w3m-color-mix': '#D4AF37',
    '--w3m-color-mix-strength': 20,
    '--w3m-accent': '#D4AF37', // Gold color for buttons
  }
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
