import { Address } from "viem";

type Chain = { id: number; name: string; environment: "testnet" | "mainnet" };
export const chains: Chain[] = [
  { id: 1, name: "Ethereum", environment: "mainnet" },
  { id: 8453, name: "Base", environment: "mainnet" },
  { id: 84532, name: "Base", environment: "testnet" },
];

export const SYMBOLS: Record<Address, string> = {
  "0x0000000000000000000000000000000000000000": "ETH",
  "0x0000000000000000000000000000000000000001": "OP",
  "0x514910771AF9Ca656af840dff83E8264EcF986CA": "LINK",
};

type ChainId = number;
type TokenAddress = string;
type PriceFeedAddress = string;

interface ChainInfo {
  name: string;
  tokenToPriceFeed: Record<TokenAddress, PriceFeedAddress>;
}

export const chainTokenPriceFeeds: Record<ChainId, ChainInfo> = {
  // Ethereum Mainnet
  1: {
    name: "Ethereum Mainnet",
    tokenToPriceFeed: {
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
        "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH/USD
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2":
        "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // WETH/USD
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48":
        "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6", // USDC/USD
      "0xdAC17F958D2ee523a2206206994597C13D831ec7":
        "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D", // USDT/USD
      "0x6B175474E89094C44Da98b954EedeAC495271d0F":
        "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9", // DAI/USD
      "0x514910771AF9Ca656af840dff83E8264EcF986CA":
        "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c", // LINK/USD
      // ... add more tokens as needed
    },
  },

  // Ethereum Sepolia
  11155111: {
    name: "Ethereum Sepolia",
    tokenToPriceFeed: {
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
        "0x694AA1769357215DE4FAC081bf1f309aDC325306", // ETH/USD
      "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9":
        "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E", // LINK/USD
      // ... add more tokens as needed
    },
  },

  // Base Mainnet
  8453: {
    name: "Base Mainnet",
    tokenToPriceFeed: {
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
        "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70", // ETH/USD
      "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb":
        "0x7e860098F58bBFC8648a4311b374B1D669a2bc6B", // DAI/USD
      // ... add more tokens as needed
    },
  },

  // Base Sepolia (Note: Price feeds may not be available for all testnets)
  84532: {
    name: "Base Sepolia",
    tokenToPriceFeed: {
      // Add when available
    },
  },

  // Optimism Mainnet
  10: {
    name: "Optimism Mainnet",
    tokenToPriceFeed: {
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
        "0x13e3Ee699D1909E989722E753853AE30b17e08c5", // ETH/USD
      "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58":
        "0x16a9FA2FDa030272Ce99B29CF780dFA30361E0f3", // USDT/USD
      "0x7F5c764cBc14f9669B88837ca1490cCa17c31607":
        "0x0D276FC14719f9292D5C1eA2198673d1f4269246", // USDC/USD
      // ... add more tokens as needed
    },
  },

  // Add more chains as needed
};
