"use client";

import { useEffect, useState } from "react";
import { Contract, BrowserProvider } from "ethers";
import { rewardContractAbi, rewardContractAddress } from "@/config/Rewards";

type Goal = {
  id: number;
  target_taps: number;
};

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
  on: (...args: unknown[]) => void;
  removeListener: (...args: unknown[]) => void;
}

export default function Goal({ currentTaps }: { currentTaps: number }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [claimedIds, setClaimedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClaimedGoals = async (provider: BrowserProvider, signerAddress: string) => {
    if (!rewardContractAddress) return;

    const signer = provider.getSigner();
    const contract = new Contract(rewardContractAddress, rewardContractAbi, await signer);

    const claimed: number[] = [];
    for (const goal of goals) {
      const isClaimed = await contract.goalClaimed(signerAddress, goal.id);
      if (isClaimed) claimed.push(goal.id);
    }
    setClaimedIds(claimed);
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch("/api/goal");
        const data = await res.json();
        if (data?.goals) setGoals(data.goals);
      } catch (err) {
        console.error("Error fetching goals:", err);
      }
    };
    fetchGoals();
  }, []);

  useEffect(() => {
    const initClaimed = async () => {
      if (!window.ethereum || goals.length === 0) return;
      const provider = new BrowserProvider(window.ethereum as unknown as EthereumProvider);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      await fetchClaimedGoals(provider, address);
    };
    initClaimed();
  }, [goals]);

  useEffect(() => {
    if (goals.length === 0) return;

    const eligibleGoals = goals.filter(g => currentTaps >= g.target_taps);
    const claimableGoals = eligibleGoals.filter(g => !claimedIds.includes(g.id));

    if (claimableGoals.length > 0) {
      const highestGoal = claimableGoals[claimableGoals.length - 1];
      setCurrentGoal(highestGoal);
      setShowModal(true);
    } else {
      const nextGoal = goals.find(g => currentTaps < g.target_taps) ?? goals[goals.length - 1];
      setCurrentGoal(nextGoal);
      setShowModal(false);
    }
  }, [goals, currentTaps, claimedIds]);

  const handleClaim = async () => {
    if (!window.ethereum || !currentGoal || !rewardContractAddress) return;

    try {
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum as unknown as EthereumProvider);
      const signer = await provider.getSigner();
      const contract = new Contract(rewardContractAddress, rewardContractAbi, signer);

      // Check again if already claimed to prevent double claim
      const address = await signer.getAddress();
      const alreadyClaimed = await contract.goalClaimed(address, currentGoal.id);
      if (alreadyClaimed) {
        console.log(`Goal ${currentGoal.id} already claimed.`);
        setClaimedIds(prev => [...prev, currentGoal.id]);
        setShowModal(false);
        return;
      }

      const tx = await contract.claimGoal(currentGoal.id);
      await tx.wait();

      console.log(`Reward for goal ${currentGoal.id} claimed!`);
      setClaimedIds(prev => [...prev, currentGoal.id]);
      setShowModal(false);
    } catch (err) {
      console.error("Error claiming reward:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentGoal) return <p className="text-gray-500">Loading goals...</p>;

  const progress = Math.min((currentTaps / currentGoal.target_taps) * 100, 100);

  return (
    <div className="w-full max-w-md bg-gray-200 rounded-2xl overflow-hidden shadow-md p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">
        Goal {currentGoal.id}: {currentGoal.target_taps} taps
      </h2>
      <div className="w-full bg-gray-300 rounded-full h-6">
        <div
          className="bg-blue-500 h-6 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-700">
        {currentTaps} / {currentGoal.target_taps} taps
      </p>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm text-center shadow-lg">
            <h3 className="text-xl font-bold mb-4">Goal Reached!</h3>
            <p className="mb-6">
              You reached {currentGoal.target_taps} taps! Claim your reward.
            </p>
            <button
              onClick={handleClaim}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? "Claiming..." : "Claim Reward"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
