"use client";
import { useState } from "react";

export default function Game() {
  const [count, setCount] = useState(0);
  const goals = [10, 50, 100];

  const handleTap = () => setCount((prev) => prev + 1);

  const handleClaim = (goal: number) => {
    alert(`Reward for ${goal} taps claimed!`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 md:px-0">
      
      {/* Tappable Div */}
      <div
        onClick={handleTap}
        className="bg-red-300 w-full max-w-xl h-64 flex flex-col items-center justify-center cursor-pointer rounded-lg shadow-lg select-none transition-transform active:scale-95"
      >
        <h1 className="text-2xl mb-2 md:mb-4">Tap Game</h1>
        <p className="mb-2 text-xl font-bold md:text-2xl">Taps: {count}</p>
        <p className="text-sm text-gray-700 md:text-base">Tap anywhere here!</p>
      </div>

      {/* Goals & Rewards */}
      <div className="w-full max-w-xl bg-blue-100 p-4 rounded-lg shadow-inner select-none flex flex-col gap-2">
        {goals.map((goal) => {
          const reached = count >= goal;
          return (
            <div
              key={goal}
              className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm"
            >
              <span className="text-lg font-medium text-black">
                {goal} taps: {reached ? "✅ reached" : "❌ not reached"}
              </span>
              {reached && (
                <button
                  onClick={() => handleClaim(goal)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors text-sm md:text-base"
                >
                  Claim Reward
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
