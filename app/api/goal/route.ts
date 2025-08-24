// app/api/goals/route.ts
import { NextResponse } from "next/server";
import { supabase } from "../../../client/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("goal")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ goals: data });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error fetching goals:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

