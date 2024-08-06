import { useState, useEffect } from "react";
import { client } from "../chain/viem";
import { Abi, Address } from "viem";

export interface FetchExchangeRateParams {
  address: string;
  abi: Abi;
  functionName: string;
  decimals: number;
}

const fetchExchangeRate = async (params: FetchExchangeRateParams) => {
  const { address, abi, functionName, decimals } = params;

  if (!address || !abi || !functionName) {
    console.error("Invalid parameters for exchange rate fetch:", {
      address,
      abi,
      functionName,
      decimals,
    });
    return null;
  }
  console.log("Calling function:", functionName);
  console.log("Contract address:", address);
  console.log("ABI:", abi);

  try {
    const [, answer, , ,] = (await client.readContract({
      address: address as Address,
      abi: abi,
      functionName: functionName,
    })) as [number, BigInt, BigInt, BigInt, number];
    console.log("Contract call result:", answer);
    return answer;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
};

const useExchangeRate = () => {
  const [exchangeRateParams, setExchangeRateParams] =
    useState<FetchExchangeRateParams>({
      address: "",
      abi: [],
      functionName:
        "function latestRoundData() returns (uint80,int256,uint256,uint256,uint80)",
      decimals: 8,
    });
  const [exchangeRate, setExchangeRate] = useState<BigInt | null>(null);
  useEffect(() => {
    const fetchRate = async () => {
      if (exchangeRateParams.address && exchangeRateParams.abi.length > 0) {
        const rate = await fetchExchangeRate(exchangeRateParams);
        setExchangeRate(rate);
      }
    };
    fetchRate();
  }, [exchangeRateParams]);
  return {
    exchangeRate,
    setExchangeRateParams,
  };
};
export default useExchangeRate;
