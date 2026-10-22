import type { ReactNode } from "react";
import { BottomMenu } from "@/components/bottom-menu";
import { Header } from "@/components/header";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="pb-28 md:pb-36">{children}</div>
      <BottomMenu />
    </>
  );
}
