import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BG_COLORS, BORDER_COLORS, COLORS } from "./constants/colors";
import seedrandom from "seedrandom";
import { Asset } from "@/components/StakeTable";
import { chainTokenPriceFeeds } from "./constants/chains";
import { Address } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getColorClass(
  color: string,
  type: "text" | "bg" | "border",
): string {
  switch (type) {
    case "text":
      return COLORS[color] || "";
    case "bg":
      return BG_COLORS[color] || "";
    case "border":
      return BORDER_COLORS[color] || "";
    default:
      return "";
  }
}

export async function getPriceFeed(chainId: number, tokenAddress: Address) {
  const chainInfo = chainTokenPriceFeeds[chainId];
  if (!chainInfo) {
    console.error(`Chain ID ${chainId} not supported`);
    return undefined;
  }

  const priceFeed = chainInfo.tokenToPriceFeed[tokenAddress] as Address;
  if (!priceFeed) {
    console.error(
      `No price feed found for token ${tokenAddress} on ${chainInfo.name}`,
    );
    return undefined;
  }
  return priceFeed;
}

export const generateFakeItem = (id: number): Asset => {
  const rng = seedrandom(`seed-${id}`);
  return {
    id,
    amount: Math.floor(rng() * 1000) + 1,
    usdcValue: Math.floor(rng() * 100) + 1,
    from: [
      "Arbitrum Sepolia",
      "Optimism",
      "Base Sepolia",
      "Ethereum Sepolia",
      "Redstone",
    ][Math.floor(rng() * 5)],
    symbol: ["USDC", "ETH", "LINK", "GHO", "OP"][Math.floor(rng() * 5)],
    token: `0x${id}`,
    status: ["pending", "processing", "success", "failed"][
      Math.floor(rng() * 4)
    ] as "pending" | "processing" | "success" | "failed",
  };
};
