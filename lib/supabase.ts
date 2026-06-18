import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export interface DbInvestigation {
  id: string;
  project_name: string;
  report: string | null;
  steps: unknown;
  created_at: string;
}

export interface DbDocument {
  id: string;
  investigation_id: string;
  url: string;
  title: string | null;
  content: string | null;
  sha256: string | null;
  tx_hash: string | null;
  block_number: number | null;
  stamped_at: string | null;
  created_at: string;
}

export interface DbInvestigationStructured {
  id: string;
  investigation_id: string;
  project_name: string;
  project: unknown;
  contracts: unknown;
  suppliers: unknown;
  payments: unknown;
  anomalies: unknown;
  created_at: string;
}
