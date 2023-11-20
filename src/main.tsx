import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { NextUIProvider } from '@nextui-org/react'

import {
  lightTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { sepolia, polygonMumbai as mumbai } from 'wagmi/chains'
//import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import './index.css'
import '@rainbow-me/rainbowkit/styles.css'

const { chains, publicClient } = configureChains(
  [sepolia, mumbai],
  // [alchemyProvider({ apiKey: '61_02oiFhc8CvMWwDnYsaCkNAuG7Ss8p' })]
  [publicProvider()]
)
const { connectors } = getDefaultWallets({
  appName: 'KIP',
  projectId: 'PROJECT_ID',
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <NextUIProvider>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        modalSize="compact"
        locale="en-US"
        chains={chains}
        theme={lightTheme()}
        showRecentTransactions
      >
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </NextUIProvider>
)
