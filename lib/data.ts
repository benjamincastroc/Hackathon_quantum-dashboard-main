export type ProjectStatus = "Healthy" | "Review" | "Warning" | "Critical";

export interface Project {
  id: number;
  name: string;
  agency: string;
  budget: number;
  executed: number; // percentage
  progress: number; // physical progress %
  risk: number; // 0–100
  status: ProjectStatus;
  contractor: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface Anomaly {
  id: number;
  title: string;
  project: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  type: "Financial" | "Procurement" | "Execution" | "Compliance" | "Supplier";
  date: string;
  description: string;
  impact: number;
}

export interface BlockchainRecord {
  id: number;
  hash: string;
  shortHash: string;
  project: string;
  action: string;
  amount: number;
  status: "Verified" | "Pending" | "Flagged";
  blockNumber: number;
  timestamp: string;
  validator: string;
}

export interface RiskDataPoint {
  week: string;
  infrastructure: number;
  health: number;
  education: number;
  transportation: number;
  all: number;
}

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ─── Projects ────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: 1,
    name: "Hospital Norte Construction",
    agency: "Ministry of Health",
    budget: 8_000_000,
    executed: 95,
    progress: 72,
    risk: 89,
    status: "Critical",
    contractor: "BuildCorp S.A.",
    location: "Northern District",
    startDate: "2023-01-15",
    endDate: "2024-12-31",
  },
  {
    id: 2,
    name: "Central Primary School",
    agency: "Ministry of Education",
    budget: 2_000_000,
    executed: 42,
    progress: 40,
    risk: 21,
    status: "Healthy",
    contractor: "EduBuild Ltd.",
    location: "City Center",
    startDate: "2023-06-01",
    endDate: "2024-06-30",
  },
  {
    id: 3,
    name: "Southern Highway Expansion",
    agency: "Ministry of Transport",
    budget: 15_000_000,
    executed: 87,
    progress: 65,
    risk: 61,
    status: "Review",
    contractor: "RoadMaster Inc.",
    location: "Southern Region",
    startDate: "2022-09-10",
    endDate: "2025-03-31",
  },
  {
    id: 4,
    name: "Water Treatment Plant Alpha",
    agency: "Ministry of Environment",
    budget: 5_500_000,
    executed: 68,
    progress: 70,
    risk: 34,
    status: "Healthy",
    contractor: "AquaTech S.A.",
    location: "Eastern Zone",
    startDate: "2023-03-20",
    endDate: "2024-09-30",
  },
  {
    id: 5,
    name: "City Metro Line 2 Extension",
    agency: "Urban Development Authority",
    budget: 45_000_000,
    executed: 31,
    progress: 28,
    risk: 73,
    status: "Warning",
    contractor: "MetroTrans Corp.",
    location: "Urban Core",
    startDate: "2023-01-01",
    endDate: "2026-12-31",
  },
  {
    id: 6,
    name: "Rural Electrification Phase 3",
    agency: "Ministry of Energy",
    budget: 3_200_000,
    executed: 55,
    progress: 52,
    risk: 45,
    status: "Review",
    contractor: "PowerGrid S.A.",
    location: "Rural Districts 4–7",
    startDate: "2023-04-01",
    endDate: "2024-11-30",
  },
  {
    id: 7,
    name: "National Bridge Rehabilitation",
    agency: "Ministry of Infrastructure",
    budget: 12_000_000,
    executed: 78,
    progress: 74,
    risk: 28,
    status: "Healthy",
    contractor: "BridgeTech Ltd.",
    location: "Multiple Regions",
    startDate: "2022-07-01",
    endDate: "2025-01-31",
  },
  {
    id: 8,
    name: "Digital Citizen Portal",
    agency: "Ministry of Digital Affairs",
    budget: 1_800_000,
    executed: 91,
    progress: 85,
    risk: 52,
    status: "Review",
    contractor: "GovTech S.A.",
    location: "National",
    startDate: "2023-05-15",
    endDate: "2024-05-14",
  },
];

// ─── Anomalies ────────────────────────────────────────────────────────────────

export const anomalies: Anomaly[] = [
  {
    id: 1,
    title: "Cost Overrun +18%",
    project: "Hospital Norte",
    severity: "Critical",
    type: "Financial",
    date: "2024-01-15",
    description:
      "Project costs exceed approved budget by 18% ($1.44M) without proper written authorization or technical justification.",
    impact: 1_440_000,
  },
  {
    id: 2,
    title: "Contractor Repetition Detected",
    project: "Southern Highway",
    severity: "High",
    type: "Procurement",
    date: "2024-01-14",
    description:
      "RoadMaster Inc. has won 7 of the last 9 public tenders in this region, suggesting bid manipulation or collusion.",
    impact: 3_200_000,
  },
  {
    id: 3,
    title: "Schedule Delay — 4 Months",
    project: "City Metro Line 2",
    severity: "High",
    type: "Execution",
    date: "2024-01-13",
    description:
      "Physical progress (28%) is critically behind financial execution (31%), indicating possible funds diversion.",
    impact: 6_750_000,
  },
  {
    id: 4,
    title: "Budget Modification Without Justification",
    project: "Hospital Norte",
    severity: "Critical",
    type: "Compliance",
    date: "2024-01-12",
    description:
      "Contract addendum #3 increased scope by $920K with no technical committee review or public disclosure.",
    impact: 920_000,
  },
  {
    id: 5,
    title: "Duplicate Payment Detected",
    project: "Southern Highway",
    severity: "Critical",
    type: "Financial",
    date: "2024-01-11",
    description:
      "Invoice #INV-2024-0341 matches a payment already processed on 2023-12-28. Potential double payment of $218K.",
    impact: 218_000,
  },
  {
    id: 6,
    title: "Supplier Conflict of Interest",
    project: "Rural Electrification",
    severity: "High",
    type: "Supplier",
    date: "2024-01-10",
    description:
      "PowerGrid S.A. shares directors with the ministry's procurement evaluation committee member.",
    impact: 480_000,
  },
];

// ─── Blockchain Records ────────────────────────────────────────────────────────

export const blockchainRecords: BlockchainRecord[] = [
  {
    id: 1,
    hash: "0x9f82ab7cd82e4a1b3f8d2c9e7a6b5f4d3c2e1a0b9d8c7f6e5d4c3b2a1f0e9d8c7",
    shortHash: "0x9f82ab7cd82e...",
    project: "Hospital Norte",
    action: "Payment Approved",
    amount: 420_000,
    status: "Verified",
    blockNumber: 18_432_901,
    timestamp: "2024-01-15 14:23:01",
    validator: "GovWatch AI Auditor v3.2",
  },
  {
    id: 2,
    hash: "0x4a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
    shortHash: "0x4a1b2c3d4e5f...",
    project: "Southern Highway",
    action: "Contract Signed",
    amount: 2_800_000,
    status: "Verified",
    blockNumber: 18_431_544,
    timestamp: "2024-01-14 09:15:44",
    validator: "GovWatch AI Auditor v3.2",
  },
  {
    id: 3,
    hash: "0xb7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8",
    shortHash: "0xb7e8f9a0b1c2...",
    project: "City Metro Line 2",
    action: "Payment Flagged",
    amount: 218_000,
    status: "Flagged",
    blockNumber: 18_430_112,
    timestamp: "2024-01-13 16:47:22",
    validator: "GovWatch AI Auditor v3.2",
  },
  {
    id: 4,
    hash: "0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
    shortHash: "0xc3d4e5f6a7b8...",
    project: "Water Treatment Alpha",
    action: "Audit Completed",
    amount: 0,
    status: "Verified",
    blockNumber: 18_428_899,
    timestamp: "2024-01-12 11:30:05",
    validator: "GovWatch AI Auditor v3.2",
  },
  {
    id: 5,
    hash: "0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
    shortHash: "0xe5f6a7b8c9d0...",
    project: "Rural Electrification",
    action: "Contract Addendum",
    amount: 480_000,
    status: "Pending",
    blockNumber: 18_427_033,
    timestamp: "2024-01-11 08:05:17",
    validator: "GovWatch AI Auditor v3.2",
  },
];

// ─── Risk Chart Data ──────────────────────────────────────────────────────────

export const weeklyRiskData: RiskDataPoint[] = [
  { week: "Wk 1", infrastructure: 32, health: 55, education: 18, transportation: 27, all: 38 },
  { week: "Wk 2", infrastructure: 38, health: 62, education: 22, transportation: 31, all: 43 },
  { week: "Wk 3", infrastructure: 41, health: 71, education: 19, transportation: 35, all: 48 },
  { week: "Wk 4", infrastructure: 45, health: 68, education: 24, transportation: 42, all: 50 },
  { week: "Wk 5", infrastructure: 50, health: 75, education: 21, transportation: 48, all: 55 },
  { week: "Wk 6", infrastructure: 47, health: 79, education: 26, transportation: 44, all: 57 },
  { week: "Wk 7", infrastructure: 55, health: 82, education: 23, transportation: 51, all: 60 },
  { week: "Wk 8", infrastructure: 58, health: 85, education: 28, transportation: 56, all: 64 },
  { week: "Wk 9", infrastructure: 61, health: 88, education: 25, transportation: 59, all: 67 },
  { week: "Wk 10", infrastructure: 64, health: 89, education: 30, transportation: 62, all: 70 },
  { week: "Wk 11", infrastructure: 60, health: 87, education: 27, transportation: 58, all: 68 },
  { week: "Wk 12", infrastructure: 63, health: 91, education: 29, transportation: 65, all: 71 },
];

// ─── Agent Modules ────────────────────────────────────────────────────────────

export const agentModules = [
  { name: "Contract Monitoring", status: "Active", health: 100 },
  { name: "Financial Analysis", status: "Active", health: 98 },
  { name: "Blockchain Validation", status: "Active", health: 100 },
  { name: "Supplier Intelligence", status: "Active", health: 94 },
  { name: "Risk Detection Engine", status: "Active", health: 97 },
  { name: "Evidence Collection", status: "Active", health: 91 },
  { name: "Compliance Monitoring", status: "Active", health: 99 },
];

// ─── Survival Engine Data ─────────────────────────────────────────────────────

export const survivalData = {
  confidence: { dataConfidence: 92, evidenceReliability: 95, status: "Healthy" as const },
  exitability: {
    rollbackReadiness: "Available" as const,
    recoveryStatus: "Operational" as const,
    emergencyMode: "Ready" as const,
  },
  dependencies: [
    { name: "Government API", status: "Healthy" as const, latency: "42ms" },
    { name: "Blockchain Node", status: "Healthy" as const, latency: "18ms" },
    { name: "Document Registry", status: "Healthy" as const, latency: "67ms" },
    { name: "Identity Service", status: "Healthy" as const, latency: "31ms" },
  ],
  execution: { latency: 120, processingCapacity: "Normal" as const, systemLoad: 41 },
  economics: {
    operatingCost: 420,
    fraudPreventionValue: 84_000,
    roi: 200,
    status: "Positive" as const,
  },
};

// ─── Treasury Data ─────────────────────────────────────────────────────────────

export const treasuryLayers = [
  {
    name: "Reserve Layer",
    percentage: 72,
    purpose: "Ensure long-term survival and operational continuity",
    color: "#3b82f6",
    amount: 30_240,
  },
  {
    name: "Revenue Layer",
    percentage: 23,
    purpose: "Support ongoing audits and autonomous monitoring",
    color: "#10b981",
    amount: 9_660,
  },
  {
    name: "Experimental Layer",
    percentage: 5,
    purpose: "Research, innovation, and anomaly-detection improvements",
    color: "#8b5cf6",
    amount: 2_100,
  },
];

export const treasuryMetrics = {
  monthlyOperatingCost: 420,
  costPerAudit: 0.18,
  estimatedPublicSavings: 84_000,
  runway: 48,
  roi: 200,
  totalReserves: 42_000,
};

// ─── Chat Suggested Prompts ───────────────────────────────────────────────────

export const chatSuggestions = [
  "Which project has the highest corruption risk?",
  "Show me all suspicious contracts.",
  "Explain the anomalies detected in Hospital Norte.",
  "Generate a complete audit report for this quarter.",
  "Which suppliers appear in multiple contracts?",
  "Show projects with unusual spending patterns.",
];

// ─── AI Chat Responses ────────────────────────────────────────────────────────

export function getAIResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("highest risk") || q.includes("most risky") || q.includes("mayor riesgo")) {
    return `## Risk Analysis — Top Priority Alert

**Hospital Norte Construction** holds the highest corruption risk score of **89/100** — classified as CRITICAL.

### Key Risk Factors Identified:
- **Financial Execution Rate:** 95% of budget consumed while physical progress is only 72% — a **23-point gap** indicating potential fund diversion
- **Unauthorized Budget Increase:** +18% cost overrun ($1.44M) without technical committee approval
- **Budget Addendum #3:** $920K scope expansion with no public disclosure
- **Contractor Pattern:** BuildCorp S.A. has recurring contracts across 4 Health Ministry projects

### Financial Impact Assessment:
| Risk Factor | Estimated Exposure |
|---|---|
| Cost overrun | $1,440,000 |
| Unexplained gap | $1,840,000 |
| Addendum #3 | $920,000 |
| **Total at Risk** | **$4,200,000** |

### Recommended Actions:
1. ⚠️ Freeze all pending payments until investigation is complete
2. 📋 Request full technical audit from independent inspectors
3. 🔍 Investigate BuildCorp S.A. ownership and beneficial beneficiaries
4. ⛓️ Submit evidence package to anti-corruption prosecutor

**Confidence Level:** 94% | **Evidence Quality:** High | **Blockchain Verified:** ✓`;
  }

  if (q.includes("suspicious contract") || q.includes("contractor") || q.includes("contrato")) {
    return `## Suspicious Contracts Analysis

I have identified **4 contracts** with significant red flags requiring immediate review:

### 1. Hospital Norte — Contract #HC-2023-0041
- **Contractor:** BuildCorp S.A. | **Value:** $8,000,000
- 🔴 Unauthorized addendum (+$920K, no committee review)
- 🔴 Cost overrun 18% above approved budget
- Risk Score: **89/100**

### 2. Southern Highway — Contract #SH-2022-0089
- **Contractor:** RoadMaster Inc. | **Value:** $15,000,000
- 🟠 Contractor won 7 of 9 recent tenders in region
- 🔴 Duplicate payment detected ($218K)
- Risk Score: **61/100**

### 3. City Metro Line 2 — Contract #ML-2023-0012
- **Contractor:** MetroTrans Corp. | **Value:** $45,000,000
- 🟠 31% budget executed vs. 28% physical progress
- 🟠 4-month schedule delay without penalty enforcement
- Risk Score: **73/100**

### 4. Rural Electrification — Contract #RE-2023-0055
- **Contractor:** PowerGrid S.A. | **Value:** $3,200,000
- 🔴 Director conflict of interest with procurement committee
- 🟠 Subcontractor relationships not disclosed
- Risk Score: **45/100**

**Total Value Under Investigation:** $71,200,000
**Confidence Level:** 91% | **Blockchain Verified:** ✓`;
  }

  if (q.includes("hospital norte") || q.includes("anomal")) {
    return `## Anomaly Deep Dive — Hospital Norte Construction

**Project ID:** HC-2023-0041 | **Risk Score:** 89/100 CRITICAL

### Anomaly #1 — Cost Overrun +18%
- **Detected:** January 15, 2024
- **Type:** Financial | **Severity:** Critical
- Approved budget: $8,000,000 | Current cost: $9,440,000
- Excess: **$1,440,000** — no written authorization found
- This exceeds the legal threshold requiring Congressional approval

### Anomaly #2 — Budget Modification Without Justification
- **Detected:** January 12, 2024
- **Type:** Compliance | **Severity:** Critical
- Contract addendum #3 added $920K in scope changes
- No technical committee meeting minutes on record
- No public notice filed (legally required >$500K modifications)

### Anomaly #3 — Execution Gap Analysis
- **Detected:** January 15, 2024 (ongoing)
- Budget executed: **95%** | Physical progress: **72%**
- Gap of **23 percentage points** — $1.84M unexplained
- Site inspection photos confirm incomplete structures

### Blockchain Evidence:
- Transaction \`0x9f82ab7cd82e...\` — Payment $420K (Verified ✓)
- Cross-referenced with invoice registry: 2 invoices unmatched

### Recommended Actions:
1. Immediate payment freeze ($580K remaining)
2. Independent forensic audit
3. Site inspection by Ministry's control unit
4. Criminal complaint to Attorney General

**Evidence Quality:** 95% | **Estimated Recoverable Funds:** $2,360,000`;
  }

  if (q.includes("audit report") || q.includes("reporte") || q.includes("report")) {
    return `## Q1 2024 — Autonomous Audit Report
**Generated:** ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })} | **Confidence:** 92%

---

### Executive Summary
GovWatch AI has monitored **124 government projects** representing **$38.4M** in public funds during Q1 2024. The autonomous agent detected **17 corruption risk events** and prevented an estimated **$4.8M** in potential losses.

### Portfolio Overview
| Status | Projects | Budget |
|---|---|---|
| 🟢 Healthy | 89 | $18.2M |
| 🟡 Under Review | 24 | $11.4M |
| 🟠 Warning | 8 | $6.8M |
| 🔴 Critical | 3 | $2.0M |

### Critical Findings
1. **Hospital Norte** — Risk 89/100 — Financial irregularities $2.36M
2. **City Metro Line 2** — Risk 73/100 — Schedule/budget gap $6.75M
3. **Southern Highway** — Risk 61/100 — Procurement irregularities $3.42M

### Financial Impact
- Total funds at risk identified: **$12,530,000**
- Fraud prevented (frozen payments): **$4,800,000**
- Ongoing investigation value: **$7,730,000**

### Blockchain Verification
All 1,247 transactions processed this quarter have been recorded on the immutable audit ledger. **98.7%** are fully verified.

### Agent Performance
- Audits completed: 26,666
- Average confidence: 92%
- System uptime: 99.97%
- Cost per audit: $0.18
- Public ROI: **200x**

**Next Scheduled Full Audit:** February 1, 2024 at 00:00 UTC`;
  }

  if (q.includes("supplier") || q.includes("proveedor") || q.includes("multiple")) {
    return `## Supplier Intelligence Report — Repeat Contractor Analysis

I have identified **3 suppliers** appearing in multiple contracts with elevated risk patterns:

### 🔴 HIGH RISK — RoadMaster Inc.
- Contracts won: **7 of 9** public tenders (Southern Region, 2022–2024)
- Total contract value: **$34,500,000**
- Statistical probability of fair competition: **< 2.1%**
- Shared addresses detected with 2 bid competitors (shell company indicators)
- Recommended action: Procurement fraud investigation

### 🟠 MEDIUM RISK — BuildCorp S.A.
- Contracts won: **4** Health Ministry projects (2021–2024)
- Total contract value: **$22,800,000**
- Director overlap with 1 Ministry official (undisclosed)
- Contract modifications exceed baseline by avg. 14%
- Recommended action: Conflict of interest review

### 🟠 MEDIUM RISK — PowerGrid S.A.
- Contracts won: **3** Energy Ministry projects
- Total contract value: **$9,600,000**
- Board member sits on procurement evaluation committee
- 2 related subcontractors not disclosed per regulations
- Recommended action: Ethics board review + disclosure audit

### Network Analysis
Cross-referencing beneficial ownership databases reveals a potential **common ownership network** connecting RoadMaster Inc. and BuildCorp S.A. through a holding company registered offshore.

**Blockchain Evidence Preserved:** 12 transaction records | **Confidence:** 88%`;
  }

  if (q.includes("spending") || q.includes("gasto") || q.includes("unusual") || q.includes("pattern")) {
    return `## Unusual Spending Pattern Analysis

AI pattern recognition has flagged the following financial anomalies across the monitored portfolio:

### Pattern 1 — End-of-Year Payment Spike
- **Projects affected:** Hospital Norte, Southern Highway
- Dec 2023 payments spiked **340%** above monthly average
- 8 payments processed in last 3 days of fiscal year
- Classic indicator of budget exhaustion fraud
- **Exposure:** $1,240,000

### Pattern 2 — Progress-Execution Divergence
Projects where money flows faster than physical work:
| Project | Executed | Physical | Gap |
|---|---|---|---|
| Hospital Norte | 95% | 72% | 23% 🔴 |
| City Metro Line 2 | 31% | 28% | 3% 🟡 |
| Digital Citizen Portal | 91% | 85% | 6% 🟡 |

### Pattern 3 — Round-Number Payments
- 14 payments identified as exact round numbers (e.g., $500,000.00, $1,000,000.00)
- Real construction invoices almost never use round numbers
- Statistically anomalous: probability < 0.003%
- **Exposure:** $6,200,000

### Pattern 4 — Weekend Approvals
- 6 high-value payments ($420K–$920K) approved on Saturdays/Sundays
- Normal approval workflows require committee quorum (weekdays only)
- All 6 bypass standard 48h review window
- **Exposure:** $3,580,000

**Total Unusual Spend Flagged:** $11,020,000
**Confidence Level:** 89% | **Blockchain Records:** 23 flagged transactions`;
  }

  // Default response
  return `## GovWatch AI Analysis

Thank you for your query. Based on current monitoring data across **124 government projects** (${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}):

### Current System Status
- **17 active risk events** under investigation
- **3 critical alerts** requiring immediate action
- **$4.8M** in fraud prevented this quarter
- System confidence: **92%** | Uptime: **99.97%**

### Most Urgent Priorities:
1. 🔴 **Hospital Norte** — Risk 89/100 — Immediate payment freeze recommended
2. 🟠 **City Metro Line 2** — Risk 73/100 — Progress-budget gap investigation
3. 🟠 **Southern Highway** — Risk 61/100 — Procurement review needed

### Suggested Next Actions:
- Ask me to analyze a specific project or contract
- Request a full audit report
- Query suspicious supplier patterns
- Review blockchain verification records

I can analyze any aspect of the monitored portfolio. What would you like to investigate?

**Confidence:** 92% | **Last Data Sync:** 2 minutes ago | **Blockchain:** ✓ Verified`;
}
