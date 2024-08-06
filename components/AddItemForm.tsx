"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { whatsabi } from "@shazow/whatsabi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { SYMBOLS, chains } from "@/lib/constants/chains";
import { getPriceFeed } from "@/lib/utils";
import {
  Abi,
  Address,
  createPublicClient,
  http,
  parseAbi,
  parseAbiItem,
  zeroAddress,
} from "viem";
import { mainnet } from "viem/chains";
import useExchangeRate, {
  FetchExchangeRateParams,
} from "@/lib/hooks/use-exchange-rate";
import useAssets from "@/lib/hooks/use-assets";

const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const formSchema = z.object({
  from: z.string(), // Chain ID
  token: z
    .string()
    .min(2)
    .max(50)
    .regex(ethereumAddressRegex, { message: "Invalid Token address" }),
  amount: z.number().min(1, { message: "Enter an amount" }),
});
export default function AddItemForm() {
  const { items, addItem } = useAssets();
  const { exchangeRate: rate, setExchangeRateParams } = useExchangeRate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const {
    formState: { errors },
    watch,
  } = form;
  const tokenAddress = watch("token") as Address;
  const chainId = parseInt(watch("from"));
  const client = useMemo(
    () =>
      createPublicClient({
        chain: mainnet,
        transport: http(),
      }),
    [],
  );
  const priceFeed = useMemo(async () => {
    return await getPriceFeed(chainId, tokenAddress);
  }, [chainId, tokenAddress]);
  const tokenInfo = useMemo(async () => {
    async function loadTokenInfo() {
      if (ethereumAddressRegex.test(tokenAddress)) {
        try {
          const code = await client.getCode({ address: tokenAddress });
          if (!code) {
            console.error("No bytecode");
            return;
          }
          console.log("Found bytecode!");
          const result = whatsabi.abiFromBytecode(code);
          if (!result) {
            console.error("No ABI fetched");
            return;
          }
          const decimals = await client.readContract({
            address: tokenAddress,
            abi: [parseAbiItem("function decimals() view returns (uint8)")],
            functionName: "decimals",
          });
          if (!decimals) {
            console.error("No decimals fetched");
            return;
          }
          return {
            abi: result,
            decimals,
          };
        } catch (error) {
          console.error("Error loading token info:", error);
        }
      }
    }
    return await loadTokenInfo();
  }, [tokenAddress, client]);
  async function onSubmit(data: z.infer<typeof formSchema>) {
    const { from, token, amount } = data;
    // Ensure tokenInfo and priceFeed are loaded
    const tokenInfoResolved = await tokenInfo;
    const priceFeedAddress = await priceFeed;
    if (!tokenInfoResolved || !priceFeedAddress) {
      console.error("ABI or Price Feed Address is missing");
      return;
    }
    const { abi, decimals } = tokenInfoResolved;
    console.log(abi);
    console.log(decimals);
    console.log(token);
    setExchangeRateParams({
      address: priceFeedAddress,
      abi: [
        parseAbiItem(
          "function latestRoundData() returns (uint80,int256,uint256,uint256,uint80)",
        ),
      ],
      functionName: "latestRoundData",
      decimals: decimals ?? 8, // Use dynamically loaded decimals, fallback to 8 if not available
    });
    if (rate === null) {
      console.error("!!! Exchange rate is loading or unavailable");
      return;
    }
    const usdcValue = (amount * Number(rate)) / 1e8;
    console.log(usdcValue.toFixed(2));
    addItem({
      from,
      token: token as Address,
      amount,
      usdcValue,
      symbol: SYMBOLS[token as Address],
    });
    // form.reset(); // Reset form after submission
  }
  useEffect(() => {
    console.log("items", items);
  }, [items]);

  return (
    <div className="relative hidden w-full flex-col items-start gap-8 md:flex">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full items-start gap-6"
        >
          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Add a Token
            </legend>
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-3">
                    <FormLabel>From</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger
                          id="model"
                          className="items-start [&_[data-description]]:hidden"
                        >
                          <SelectValue placeholder="Select a chain" />
                        </SelectTrigger>
                      </FormControl>
                      {!errors.from ? (
                        <FormDescription>
                          The chain of the asset to swap.
                        </FormDescription>
                      ) : (
                        <FormMessage />
                      )}
                      <SelectContent>
                        {chains.map((chain) => (
                          <SelectItem key={chain.id} value={`${chain.id}`}>
                            <div className="flex items-start gap-3 text-muted-foreground">
                              {/* <Blocks className="size-5" /> */}
                              <div className="grid gap-0.5">
                                <p className="font-medium text-foreground">
                                  <span>{chain.name}</span>
                                </p>
                                <p
                                  className="text-xs capitalize"
                                  data-description
                                >
                                  {chain.environment}
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormItem>
              )}
            />
            <div className="grid min-h-32 grid-cols-2 items-center gap-2">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <FormLabel>Token</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger
                            id="token"
                            className="translate-y-[5px] items-start [&_[data-description]]:hidden"
                          >
                            <SelectValue placeholder="Select a ticker" />
                          </SelectTrigger>
                        </FormControl>

                        {!errors.token ? (
                          <FormDescription>The asset to swap.</FormDescription>
                        ) : (
                          <FormMessage />
                        )}
                        <SelectContent>
                          <SelectItem value="0x0000000000000000000000000000000000000000">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              {/* <Circle className="size-5" /> */}
                              <div className="grid gap-0.5">
                                <p>
                                  Optimism{" "}
                                  <span className="font-medium text-foreground">
                                    OP
                                  </span>
                                </p>
                                <p className="text-xs" data-description>
                                  Mainnet
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="0x0000000000000000000000000000000000000001">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              {/* <Circle className="size-5" /> */}
                              <div className="grid gap-0.5">
                                <p>
                                  Sepolia Ether{" "}
                                  <span className="font-medium text-foreground">
                                    ETH
                                  </span>
                                </p>
                                <p className="text-xs" data-description>
                                  Testnet
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="0x514910771AF9Ca656af840dff83E8264EcF986CA">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              {/* <Circle className="size-5" /> */}
                              <div className="grid gap-0.5">
                                <p>
                                  Chainlink{" "}
                                  <span className="font-medium text-foreground">
                                    LINK
                                  </span>
                                </p>
                                <p className="text-xs" data-description>
                                  Mainnet
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="grid gap-3">
                        <Input
                          type="number"
                          placeholder="0.1"
                          onChange={(e) =>
                            form.setValue("amount", Number(e.target.value))
                          }
                          value={field.value || ""}
                        />
                      </div>
                    </FormControl>
                    {!errors.amount ? (
                      <FormDescription>The amount of tokens.</FormDescription>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" size={"lg"} variant={"secondary"}>
              Add Item
            </Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
