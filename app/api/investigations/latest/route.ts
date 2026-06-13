import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { InvestigationData } from "@/lib/investigation-store";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("investigation_structured")
      .select("*, investigations(project_name, created_at)")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ data: null });
    }

    const inv: InvestigationData = {
      projectName: data.project_name,
      investigatedAt: data.created_at,
      project: data.project as InvestigationData["project"],
      contracts: (data.contracts as InvestigationData["contracts"]) ?? [],
      suppliers: (data.suppliers as InvestigationData["suppliers"]) ?? [],
      payments: (data.payments as InvestigationData["payments"]) ?? [],
      anomalies: (data.anomalies as InvestigationData["anomalies"]) ?? [],
    };

    return NextResponse.json({ data: inv });
  } catch (err) {
    console.error("[investigations/latest]", err);
    return NextResponse.json({ data: null });
  }
}
