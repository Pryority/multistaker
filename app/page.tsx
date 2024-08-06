import { InitialDataFetcher } from "@/components/InitialDataFetcher";
import Spacer from "@/components/Spacer";
import StakeModule from "@/components/StakeModule";
import { Suspense } from "react";

export default async function Home() {
  const { initialItems } = await InitialDataFetcher();

  return (
    <Spacer>
      <div className="grid w-full grid-cols-1">
        <Suspense fallback={<div>Loading...</div>}>
          <StakeModule initialItems={initialItems} />
        </Suspense>
      </div>
    </Spacer>
  );
}
