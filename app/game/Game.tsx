"use client";
import { WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet";
import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import Goal from "./Goal";

type Bubble = {
  id: number;
  left: number;
  top: number;
  size: number;
};

export default function Game() {
  const { address } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [taps, setTaps] = useState<number>(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // Local buffer for batching taps
  const localTapBuffer = useRef<number>(0);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    spawnBubbles(20);
  }, []);

  const spawnBubbles = (count: number) => {
    const newBubbles: Bubble[] = [];
    for (let i = 0; i < count; i++) {
      newBubbles.push({
        id: Date.now() + Math.random() * 1000,
        left: Math.random() * 90 + 5,
        top: Math.random() * 90 + 5,
        size: Math.random() * 50 + 40,
      });
    }
    setBubbles(prev => [...prev, ...newBubbles]);
  };

const sendBatchedTaps = async () => {
  if (!address || localTapBuffer.current === 0) return;

  const tapsToSend = localTapBuffer.current;
  localTapBuffer.current = 0;

  try {
    const res = await fetch("/api/tap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: address, taps: tapsToSend }), 
    });
    const data = await res.json();
    if (data?.player) {
      setTaps(data.player.tap_count); 
    }
  } catch (err) {
    console.error("Error updating taps:", err);
    localTapBuffer.current += tapsToSend; 
  }
};


  const handleTap = () => {
    if (!address) return alert("Connect your wallet first!");
    setTaps(prev => prev + 1);
    localTapBuffer.current += 1;

    spawnBubbles(Math.floor(Math.random() * 2) + 1);

    // Batch updates: wait 2s after last tap to send
    if (tapTimeout.current) clearTimeout(tapTimeout.current);
    tapTimeout.current = setTimeout(() => {
      sendBatchedTaps();
    }, 2000);
  };

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    handleTap();
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <p className="text-blue-800">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10 px-4 md:px-0 bg-gradient-to-br from-blue-100 via-white to-blue-50 relative overflow-hidden">
      <Goal currentTaps={taps} />

      <div className="w-full max-w-5xl h-[60vh] relative rounded-xl overflow-hidden cursor-pointer">
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            className="absolute bg-blue-500 rounded-full shadow-lg animate-bounce cursor-pointer transition-transform duration-150 hover:scale-110"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
            }}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg px-6 py-4 text-center w-full max-w-md">
        <WalletDropdownDisconnect className="text-white hover:text-red-800" />
      </div>
    </div>
  );
}
