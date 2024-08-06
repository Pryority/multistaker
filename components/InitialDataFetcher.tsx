import { Asset } from "./StakeTable";

const generateFakeItem = (id: number): Asset => ({
  id,
  amount: Math.floor(Math.random() * 1000) + 1,
  usdcValue: Math.floor(Math.random() * 100) + 1,
  from: [
    "Arbitrum Sepolia",
    "Optimism",
    "Base Sepolia",
    "Ethereum Sepolia",
    "Redstone",
  ][Math.floor(Math.random() * 5)],
  symbol: ["USDC", "ETH", "LINK", "GHO", "OP"][Math.floor(Math.random() * 5)],
  token: `0x${id}`,
  status: ["pending", "processing", "success", "failed"][
    Math.floor(Math.random() * 4)
  ] as Asset["status"],
});

export async function InitialDataFetcher() {
  const initialItems = [
    generateFakeItem(1),
    generateFakeItem(2),
    generateFakeItem(3),
    generateFakeItem(4),
    generateFakeItem(5),
  ];

  return { initialItems };
}
