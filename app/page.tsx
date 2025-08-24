"use client";

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { useAccount } from "wagmi";
import Game from "./game/Game";

export default function App() {
  const { address, isConnected } = useAccount(); 

  if (isConnected && address) {
    return <Game />; 
  }

  return (
    <div className="flex items-center justify-center min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
      <div className="w-full max-w-sm p-6 rounded-2xl shadow-lg bg-gray-100 dark:bg-gray-900 text-center">
        <h1 className="text-2xl font-bold mb-6">Connect Your Wallet</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Please connect your wallet to continue to the game.
        </p>

        <Wallet className="w-full flex justify-center">
          <ConnectWallet className="flex items-center justify-center space-x-2 px-4 py-5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>

          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
              <EthBalance />
            </Identity>
            <WalletDropdownLink
              icon="wallet"
              href="https://keys.coinbase.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wallet
            </WalletDropdownLink>
          </WalletDropdown>
        </Wallet>
      </div>
    </div>
  );
}
