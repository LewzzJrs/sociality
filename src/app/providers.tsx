"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        theme="dark"
        position="top-right"
        offset={{ top: 96 }}
        toastOptions={{
          classNames: {
            toast:
              "!rounded-md !border-0 !text-sm !font-semibold !tracking-[-0.02em] !text-white",
            success: "!bg-accent-green",
            error: "!bg-accent-red",
          },
        }}
      />
    </QueryClientProvider>
  );
}
