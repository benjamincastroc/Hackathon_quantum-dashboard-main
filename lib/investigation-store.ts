export interface InvContract {
  id: string;
  title: string;
  vendor: string;
  value: string;
  status: "Active" | "Review" | "Flagged";
  risk: "low" | "medium" | "high";
}

export interface InvSupplier {
  name: string;
  category: string;
  contracts: number;
  totalValue: string;
  score: number;
  trend: "up" | "down";
}

export interface InvPayment {
  id: string;
  vendor: string;
  amount: string;
  date: string;
  status: "Completed" | "Pending" | "Flagged";
  type: "out";
}

export interface InvAnomaly {
  id: number;
  title: string;
  project: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  type: "Financial" | "Procurement" | "Execution" | "Compliance" | "Supplier";
  date: string;
  description: string;
  impact: number;
}

export interface InvProject {
  name: string;
  agency: string;
  budget: number;
  executed: number;
  progress: number;
  risk: number;
  status: "Healthy" | "Review" | "Warning" | "Critical";
  contractor: string;
  location: string;
}

export interface InvestigationData {
  projectName: string;
  investigatedAt: string;
  project: InvProject;
  contracts: InvContract[];
  suppliers: InvSupplier[];
  payments: InvPayment[];
  anomalies: InvAnomaly[];
}

const KEY = "govwatch_investigation";

export function saveInvestigation(data: InvestigationData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("govwatch:investigation", { detail: data }));
}

export function loadInvestigation(): InvestigationData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as InvestigationData) : null;
  } catch {
    return null;
  }
}

export function clearInvestigation(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("govwatch:investigation", { detail: null }));
}
