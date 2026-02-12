'use client';
import { useCavos } from "@cavos/react";

export default function Home() {
  const { login, logout, address, isAuthenticated, isLoading } = useCavos();

  if (isLoading) return <div className="p-20 text-center">Loading signer...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 font-sans">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tighter">My Cavos App</h1>
        
        {!isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-gray-500">A new era of invisible wallets on Starknet.</p>
            <button
              onClick={() => login("google")}
              className="px-8 py-4 bg-black text-white rounded-2xl font-bold hover:opacity-90 transition-all"
            >
              Login with Google
            </button>
          </div>
        ) : (
          <div className="space-y-6 p-10 bg-gray-50 rounded-[2rem] border border-gray-100">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Connected Wallet</p>
            <p className="font-mono text-xl break-all">{address}</p>
            <button
              onClick={() => logout()}
              className="text-red-500 font-bold hover:underline"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
