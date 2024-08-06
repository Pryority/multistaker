import { createPublicClient, createWalletClient, custom, http } from "viem";
import { base, mainnet } from "viem/chains";

// Set up public (READ) client with desired chain & transport.
export const client = createPublicClient({
  chain: mainnet,
  transport: http(),
}); // --> Usage: const blockNumber = await client.getBlockNumber()

let walletClient: ReturnType<typeof createWalletClient> | null = null;

if (typeof window !== "undefined") {
  walletClient = createWalletClient({
    chain: mainnet,
    transport: custom(window.ethereum!),
  });
}

export { walletClient };
