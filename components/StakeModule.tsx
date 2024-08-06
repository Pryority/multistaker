"use client";
import { useEffect, useMemo, useState } from "react";
import Circle from "./Circle";
import { Button } from "./ui/button";
import { Asset, StakeTable } from "./StakeTable";
import { useAtom } from "jotai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { abi } from "@/lib/chain/price-feed";
import { client } from "@/lib/chain/viem";
import AddItemForm from "./AddItemForm";
import useExchangeRate, {
  FetchExchangeRateParams,
} from "@/lib/hooks/use-exchange-rate";
import { Abi } from "viem";
import useAssets from "@/lib/hooks/use-assets";

export default function StakeModule({
  initialItems,
}: {
  initialItems: Asset[];
}) {
  useState<FetchExchangeRateParams | null>(null);
  const { exchangeRate: rate } = useExchangeRate();

  const { items, addItem } = useAssets();

  const usdcValueTotal = useMemo(() => {
    return items.reduce(
      (total: number, item: Asset) => total + item.usdcValue,
      0,
    );
  }, [items]);

  const ethValueTotal = useMemo(() => {
    return rate ? usdcValueTotal / Number(rate) : 0;
  }, [usdcValueTotal, rate]);

  // useEffect(() => {
  //   setItems(initialItems);
  // }, [initialItems, setItems]);

  return (
    <section className="flex flex-col items-center">
      <div className="grid w-full grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <section className="flex w-full flex-col items-center gap-10">
            <div className="flex w-full flex-col items-center gap-4">
              <Circle items={items} />
            </div>
          </section>
        </div>
        <div className="flex flex-col items-center gap-8">
          <AddItemForm />
        </div>
      </div>
      <StakeTable />
      <div className="flex min-w-[50svw] flex-col items-center gap-8">
        <TotalStakeUSD
          usdcValueTotal={usdcValueTotal}
          ethValueTotal={ethValueTotal}
        />
        <Button
          size={"lg"}
          className="min-w-40 border-4 border-green-800 text-xl font-bold uppercase"
        >
          Confirm
        </Button>
      </div>
    </section>
  );
}

function TotalStakeUSD({
  usdcValueTotal,
  ethValueTotal,
}: {
  usdcValueTotal: number;
  ethValueTotal: number;
}) {
  return (
    <Card className="max-h-32 w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total Value to Stake
        </CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${usdcValueTotal.toFixed(2)} USD
        </div>
        <p className="text-xs text-muted-foreground">
          {ethValueTotal.toFixed(4)} ETH
        </p>
      </CardContent>
    </Card>
  );
}
