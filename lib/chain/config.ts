import { Chain, HttpTransport } from "viem";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import {
  mainnet,
  sepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  zora,
  zoraSepolia,
} from "wagmi/chains";
import { TransportConfig } from "../types";
export const SUPERCHAIN = [
  mainnet,
  sepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  zora,
  zoraSepolia,
] as readonly [Chain, ...Chain[]];
export const transports: TransportConfig = Object.fromEntries(
  SUPERCHAIN.map((chain) => [chain.id, http()]),
);
export const config = createConfig({
  chains: SUPERCHAIN,
  transports: Object.fromEntries(SUPERCHAIN.map((chain) => [chain.id, http()])),
  connectors: [
    coinbaseWallet({
      appName: "MultiStaker",
      // appLogoUrl: "https://.png",
    }),
    injected(),
    // walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! }),
  ],
  ssr: true,
  storage: createStorage({
    key: "MultiStaker",
    storage: cookieStorage,
  }),
});
