import { ReactNode } from "react";

export default async function Spacer({ children }: { children: ReactNode }) {
  return <div className="flex w-full p-8">{children}</div>;
}
