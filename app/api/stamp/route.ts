import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { stampOnSyscoin, SYSCOIN_EXPLORER } from "@/lib/blockchain";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { documentId } = await req.json();
    if (!documentId) {
      return NextResponse.json({ error: "documentId requerido" }, { status: 400 });
    }

    const { data: doc, error: fetchErr } = await supabase
      .from("documents")
      .select("id, sha256, tx_hash, stamped_at")
      .eq("id", documentId)
      .single();

    if (fetchErr || !doc) {
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 });
    }

    if (doc.tx_hash) {
      return NextResponse.json({
        txHash: doc.tx_hash,
        explorerUrl: `${SYSCOIN_EXPLORER}/${doc.tx_hash}`,
        alreadyStamped: true,
        stampedAt: doc.stamped_at,
      });
    }

    if (!doc.sha256) {
      return NextResponse.json({ error: "Documento sin hash SHA-256" }, { status: 400 });
    }

    const result = await stampOnSyscoin(doc.sha256);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const { error: updateErr } = await supabase
      .from("documents")
      .update({
        tx_hash: result.txHash,
        block_number: result.blockNumber,
        stamped_at: new Date().toISOString(),
      })
      .eq("id", documentId);

    if (updateErr) {
      console.error("[Stamp] Error actualizando Supabase:", updateErr);
    }

    return NextResponse.json({
      txHash: result.txHash,
      blockNumber: result.blockNumber,
      explorerUrl: `${SYSCOIN_EXPLORER}/${result.txHash}`,
      alreadyStamped: false,
    });
  } catch (error) {
    console.error("[Stamp] Error:", error);
    return NextResponse.json({ error: `Error interno: ${error}` }, { status: 500 });
  }
}
