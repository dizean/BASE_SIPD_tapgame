/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../../../client/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { walletAddress, taps } = body;

    if (!walletAddress || taps === undefined || taps === null) {
      return NextResponse.json(
        { error: "Missing walletAddress or taps" },
        { status: 400 }
      );
    }

    // Ensure player exists
    const { data: player, error: upsertError } = await supabase
      .from("player")
      .upsert({ wallet_address: walletAddress }, { onConflict: "wallet_address" })
      .select()
      .single();

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    // If taps > 0, increment
    let updatedPlayer = player;
    if (taps > 0) {
      const { data: updated, error: updateError } = await supabase
        .from("player")
        .update({
          tap_count: (player.tap_count || 0) + taps,
          last_tap: new Date().toISOString(),
        })
        .eq("wallet_address", walletAddress)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      updatedPlayer = updated;
    }

    return NextResponse.json({ success: true, player: updatedPlayer });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
