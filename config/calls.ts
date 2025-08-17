const counterContractAddress =
  "0xf42584964fccf33ef3084B243Af5Eb869Dc02E46" as const;

const counterContractAbi = [
  {
    type: "function",
    name: "increment",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setNumber",
    inputs: [{ internalType: "uint256", name: "newNumber", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "number",
    inputs: [],
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export const calls = [
  {
    address: counterContractAddress,
    abi: counterContractAbi,
    functionName: "increment",
    args: [],
  },
  {
    address: counterContractAddress,
    abi: counterContractAbi,
    functionName: "setNumber",
    args: [42n], 
  },
  {
    address: counterContractAddress,
    abi: counterContractAbi,
    functionName: "number",
    args: [],
  },
];
