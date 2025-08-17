"use client";
import { useReadContract } from "wagmi";
import { calls } from "../config/calls";

export default function CounterValue() {
  const { data, isLoading, error } = useReadContract({
    address: calls[0].address as `0x${string}`,
    abi: calls[0].abi,
    functionName: "number",
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <p>Counter Value: {(data as bigint)?.toString()}</p>;
}
