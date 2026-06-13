import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("id, url, title, sha256, tx_hash, block_number, stamped_at, investigation_id, investigations(project_name)")
      .not("tx_hash", "is", null)
      .order("stamped_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("[blockchain/records]", error.message);
      return NextResponse.json({ records: [] });
    }

    const records = (data ?? []).map((d, i) => ({
      id: i + 1,
      txHash: d.tx_hash,
      shortHash: d.tx_hash ? `${d.tx_hash.slice(0, 14)}…` : "—",
      project: (d.investigations as unknown as { project_name: string } | null)?.project_name ?? "—",
      title: d.title ?? d.url,
      sha256: d.sha256,
      blockNumber: d.block_number ?? 0,
      status: d.block_number ? "Verified" : "Pending",
      timestamp: d.stamped_at
        ? new Date(d.stamped_at).toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" })
        : "—",
    }));

    return NextResponse.json({ records });
  } catch (err) {
    console.error("[blockchain/records]", err);
    return NextResponse.json({ records: [] });
  }
}
