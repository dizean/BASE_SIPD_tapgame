// Address of the deployed Rewards contract
export const rewardContractAddress = process.env.NEXT_PUBLIC_SIPD_REWARD_ADDRESS;

export const rewardContractAbi = [
  {
    type: "function",
    name: "claimGoal",
    stateMutability: "nonpayable",
    inputs: [{ name: "goalId", type: "uint256", internalType: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "goalClaimed",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address", internalType: "address" },
      { name: "goalId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
  },
  {
    type: "function",
    name: "goals",
    stateMutability: "view",
    inputs: [{ name: "goalId", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "reward", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    name: "token",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract SIPDToken" }],
  },
  {
    type: "function",
    name: "claimGoal",
    stateMutability: "nonpayable", 
    inputs: [{ name: "goalId", type: "uint256", internalType: "uint256" }],
    outputs: [],
  },
] as const;
