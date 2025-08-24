import { supabase } from "../../../client/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress, goalId, goalTarget } = req.body;

  if (!walletAddress) return res.status(400).json({ error: "No wallet address" });

  // Get player
  const { data: player, error } = await supabase
    .from("players")
    .select("tap_count")
    .eq("wallet_address", walletAddress)
    .single();

  if (error || !player) return res.status(404).json({ error: "Player not found" });

  if (player.tap_count < goalTarget) {
    return res.status(400).json({ error: "Not enough taps yet" });
  }

  // Mark reward as claimable (off-chain)
  const { error: insertError } = await supabase
    .from("rewards")
    .insert({ wallet_address: walletAddress, goal_id: goalId, claimed: false });

  if (insertError) return res.status(500).json({ error: insertError });

  // Return OK — frontend can now call smart contract `claimReward()`
  res.status(200).json({ success: true, message: "Eligible for claim" });
}
