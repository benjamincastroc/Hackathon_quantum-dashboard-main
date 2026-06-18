import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { InvProject } from "@/lib/investigation-store";

export interface InvestigatedProject {
  investigationId: string;
  projectName: string;
  investigatedAt: string;
  project: InvProject;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("investigation_structured")
      .select("investigation_id, project_name, created_at, project")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) {
      return NextResponse.json({ data: [] });
    }

    const result: InvestigatedProject[] = data
      .filter((row) => row.project)
      .map((row) => ({
        investigationId: row.investigation_id,
        projectName: row.project_name,
        investigatedAt: row.created_at,
        project: row.project as InvProject,
      }));

    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("[investigations/all]", err);
    return NextResponse.json({ data: [] });
  }
}
