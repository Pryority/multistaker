import { ReactNode } from "react";

export default async function PageWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center">{children}</main>
  );
}
