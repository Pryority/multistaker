import { Address, http } from "viem";

export type StakeItem = {
  chainId: number;
  tokenAddress: Address;
  amount: number;
};

export type TransportConfig = Record<number, ReturnType<typeof http>>;
