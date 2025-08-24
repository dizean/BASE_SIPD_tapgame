"use client";

import { useAccount, useReadContract } from "wagmi";
import { rewardContractAbi, rewardContractAddress } from "./Rewards";
import { SIPDTokenABI, SIPDTokenContractAddress } from "./SIPDToken";
import { Address } from "viem";

export function Contract() {
  const { address } = useAccount();

  const { data: tokenAddr } = useReadContract({
    address: rewardContractAddress as Address,
    abi: rewardContractAbi,
    functionName: "token",
  });

  const { data: goalClaimedStatus } = useReadContract({
    address: rewardContractAddress as Address,
    abi: rewardContractAbi,
    functionName: "goalClaimed",
    args: address ? [address as Address, 1n] : undefined,
    query: { enabled: !!address },
  });

  const { data: goalData } = useReadContract({
    address: rewardContractAddress as Address,
    abi: rewardContractAbi,
    functionName: "goals",
    args: [1n], // bigint
  });

  const { data: totalSupply } = useReadContract({
    address: SIPDTokenContractAddress as Address,
    abi: SIPDTokenABI,
    functionName: "getSupply",
  });

  const { data: decimals } = useReadContract({
    address: SIPDTokenContractAddress as Address,
    abi: SIPDTokenABI,
    functionName: "decimals",
  });

  const { data: symbol } = useReadContract({
    address: SIPDTokenContractAddress as Address,
    abi: SIPDTokenABI,
    functionName: "symbol",
  });

  const { data: name } = useReadContract({
    address: SIPDTokenContractAddress as Address,
    abi: SIPDTokenABI,
    functionName: "name",
  });

  const { data: balance } = useReadContract({
    address: SIPDTokenContractAddress as Address,
    abi: SIPDTokenABI,
    functionName: "balanceOf",
    args: address ? [address as Address] : undefined,
    query: { enabled: !!address },
  });

  return {
    tokenAddr,
    totalSupply,
    decimals,
    symbol,
    name,
    balance,
    goalClaimedStatus,
    goalData,
  };
}
