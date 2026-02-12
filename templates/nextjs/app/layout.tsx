'use client';
import { CavosProvider } from "@cavos/react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CavosProvider
          config={{
            appId: process.env.NEXT_PUBLIC_CAVOS_APP_ID || "",
            network: "sepolia", // Default to testnet
          }}
        >
          {children}
        </CavosProvider>
      </body>
    </html>
  );
}
