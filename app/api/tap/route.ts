import { supabase } from "../../../client/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { walletAddress, taps } = body; 

  if (!walletAddress || !taps) {
    return NextResponse.json({ error: "Missing wallet address or taps" }, { status: 400 });
  }

  // Ensure player exists
  const { data, error } = await supabase
    .from("player")
    .upsert({ wallet_address: walletAddress }, { onConflict: "wallet_address" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  // Increment tap count by number of taps sent
  const { data: updated, error: updateError } = await supabase
    .from("player")
    .update({
      tap_count: (data.tap_count || 0) + taps,
      last_tap: new Date().toISOString(),
    })
    .eq("wallet_address", walletAddress)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError }, { status: 500 });
  }

  return NextResponse.json({ success: true, player: updated });
}
