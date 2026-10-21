import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_25%_100%,#522BC8_0%,#5613A3_35%,transparent_70%)]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
