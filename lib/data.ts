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
    name: "Construcción Hospital Norte",
    agency: "Ministerio de Salud",
    budget: 8_000_000,
    executed: 95,
    progress: 72,
    risk: 89,
    status: "Critical",
    contractor: "BuildCorp S.A.",
    location: "Distrito Norte",
    startDate: "2023-01-15",
    endDate: "2024-12-31",
  },
  {
    id: 2,
    name: "Escuela Primaria Central",
    agency: "Ministerio de Educación",
    budget: 2_000_000,
    executed: 42,
    progress: 40,
    risk: 21,
    status: "Healthy",
    contractor: "EduBuild Ltd.",
    location: "Centro de la Ciudad",
    startDate: "2023-06-01",
    endDate: "2024-06-30",
  },
  {
    id: 3,
    name: "Ampliación Carretera Sur",
    agency: "Ministerio de Transportes",
    budget: 15_000_000,
    executed: 87,
    progress: 65,
    risk: 61,
    status: "Review",
    contractor: "RoadMaster Inc.",
    location: "Región Sur",
    startDate: "2022-09-10",
    endDate: "2025-03-31",
  },
  {
    id: 4,
    name: "Planta de Tratamiento de Agua Alfa",
    agency: "Ministerio del Ambiente",
    budget: 5_500_000,
    executed: 68,
    progress: 70,
    risk: 34,
    status: "Healthy",
    contractor: "AquaTech S.A.",
    location: "Zona Este",
    startDate: "2023-03-20",
    endDate: "2024-09-30",
  },
  {
    id: 5,
    name: "Extensión Metro Línea 2",
    agency: "Autoridad de Desarrollo Urbano",
    budget: 45_000_000,
    executed: 31,
    progress: 28,
    risk: 73,
    status: "Warning",
    contractor: "MetroTrans Corp.",
    location: "Núcleo Urbano",
    startDate: "2023-01-01",
    endDate: "2026-12-31",
  },
  {
    id: 6,
    name: "Electrificación Rural Fase 3",
    agency: "Ministerio de Energía",
    budget: 3_200_000,
    executed: 55,
    progress: 52,
    risk: 45,
    status: "Review",
    contractor: "PowerGrid S.A.",
    location: "Distritos Rurales 4–7",
    startDate: "2023-04-01",
    endDate: "2024-11-30",
  },
  {
    id: 7,
    name: "Rehabilitación de Puentes Nacionales",
    agency: "Ministerio de Infraestructura",
    budget: 12_000_000,
    executed: 78,
    progress: 74,
    risk: 28,
    status: "Healthy",
    contractor: "BridgeTech Ltd.",
    location: "Múltiples Regiones",
    startDate: "2022-07-01",
    endDate: "2025-01-31",
  },
  {
    id: 8,
    name: "Portal Ciudadano Digital",
    agency: "Ministerio de Asuntos Digitales",
    budget: 1_800_000,
    executed: 91,
    progress: 85,
    risk: 52,
    status: "Review",
    contractor: "GovTech S.A.",
    location: "Nacional",
    startDate: "2023-05-15",
    endDate: "2024-05-14",
  },
];

// ─── Anomalies ────────────────────────────────────────────────────────────────

export const anomalies: Anomaly[] = [
  {
    id: 1,
    title: "Sobrecosto +18%",
    project: "Hospital Norte",
    severity: "Critical",
    type: "Financial",
    date: "2024-01-15",
    description:
      "Los costos del proyecto superan el presupuesto aprobado en 18% ($1.44M) sin autorización escrita ni justificación técnica.",
    impact: 1_440_000,
  },
  {
    id: 2,
    title: "Repetición de Contratista Detectada",
    project: "Carretera Sur",
    severity: "High",
    type: "Procurement",
    date: "2024-01-14",
    description:
      "RoadMaster Inc. ha ganado 7 de las últimas 9 licitaciones públicas en esta región, lo que sugiere manipulación o colusión.",
    impact: 3_200_000,
  },
  {
    id: 3,
    title: "Retraso de Obra — 4 Meses",
    project: "Metro Línea 2",
    severity: "High",
    type: "Execution",
    date: "2024-01-13",
    description:
      "El avance físico (28%) está críticamente por debajo de la ejecución financiera (31%), lo que indica posible desvío de fondos.",
    impact: 6_750_000,
  },
  {
    id: 4,
    title: "Modificación Presupuestal Sin Justificación",
    project: "Hospital Norte",
    severity: "Critical",
    type: "Compliance",
    date: "2024-01-12",
    description:
      "La adenda #3 del contrato incrementó el alcance en $920K sin revisión del comité técnico ni divulgación pública.",
    impact: 920_000,
  },
  {
    id: 5,
    title: "Pago Duplicado Detectado",
    project: "Carretera Sur",
    severity: "Critical",
    type: "Financial",
    date: "2024-01-11",
    description:
      "La factura #INV-2024-0341 coincide con un pago ya procesado el 2023-12-28. Posible doble pago de $218K.",
    impact: 218_000,
  },
  {
    id: 6,
    title: "Conflicto de Interés con Proveedor",
    project: "Electrificación Rural",
    severity: "High",
    type: "Supplier",
    date: "2024-01-10",
    description:
      "PowerGrid S.A. comparte directivos con un miembro del comité de evaluación de adquisiciones del ministerio.",
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
    action: "Pago Aprobado",
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
    project: "Carretera Sur",
    action: "Contrato Firmado",
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
    project: "Metro Línea 2",
    action: "Pago Marcado",
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
    project: "Planta de Agua Alfa",
    action: "Auditoría Completada",
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
    project: "Electrificación Rural",
    action: "Adenda de Contrato",
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
  { name: "Monitoreo de Contratos", status: "Activo", health: 100 },
  { name: "Análisis Financiero", status: "Activo", health: 98 },
  { name: "Validación Blockchain", status: "Activo", health: 100 },
  { name: "Inteligencia de Proveedores", status: "Activo", health: 94 },
  { name: "Motor de Detección de Riesgos", status: "Activo", health: 97 },
  { name: "Recolección de Evidencias", status: "Activo", health: 91 },
  { name: "Monitoreo de Cumplimiento", status: "Activo", health: 99 },
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
    { name: "API Gubernamental", status: "Healthy" as const, latency: "42ms" },
    { name: "Nodo Blockchain", status: "Healthy" as const, latency: "18ms" },
    { name: "Registro de Documentos", status: "Healthy" as const, latency: "67ms" },
    { name: "Servicio de Identidad", status: "Healthy" as const, latency: "31ms" },
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
    name: "Capa de Reserva",
    percentage: 72,
    purpose: "Garantizar la supervivencia a largo plazo y la continuidad operativa",
    color: "#3b82f6",
    amount: 30_240,
  },
  {
    name: "Capa de Ingresos",
    percentage: 23,
    purpose: "Sostener auditorías continuas y monitoreo autónomo",
    color: "#10b981",
    amount: 9_660,
  },
  {
    name: "Capa Experimental",
    percentage: 5,
    purpose: "Investigación, innovación y mejora de detección de anomalías",
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
  "¿Qué proyecto tiene el mayor riesgo de corrupción?",
  "Muéstrame todos los contratos sospechosos.",
  "Explica las anomalías detectadas en Hospital Norte.",
  "Genera un informe de auditoría completo para este trimestre.",
  "¿Qué proveedores aparecen en múltiples contratos?",
  "Muestra proyectos con patrones de gasto inusuales.",
];

// ─── AI Chat Responses ────────────────────────────────────────────────────────

export function getAIResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("highest risk") || q.includes("most risky") || q.includes("mayor riesgo")) {
    return `## Análisis de Riesgo — Alerta de Máxima Prioridad

**Construcción Hospital Norte** tiene la puntuación de riesgo de corrupción más alta: **89/100** — clasificada como CRÍTICA.

### Factores de Riesgo Identificados:
- **Ejecución Financiera:** 95% del presupuesto consumido con solo 72% de avance físico — una **brecha de 23 puntos** que indica posible desvío de fondos
- **Sobrecosto No Autorizado:** +18% ($1.44M) sin aprobación del comité técnico
- **Adenda #3:** Ampliación de $920K sin divulgación pública
- **Patrón de Contratista:** BuildCorp S.A. tiene contratos recurrentes en 4 proyectos del Ministerio de Salud

### Evaluación de Impacto Financiero:
| Factor de Riesgo | Exposición Estimada |
|---|---|
| Sobrecosto | $1,440,000 |
| Brecha inexplicada | $1,840,000 |
| Adenda #3 | $920,000 |
| **Total en Riesgo** | **$4,200,000** |

### Acciones Recomendadas:
1. ⚠️ Congelar todos los pagos pendientes hasta completar la investigación
2. 📋 Solicitar auditoría técnica independiente
3. 🔍 Investigar propiedad de BuildCorp S.A. y beneficiarios reales
4. ⛓️ Remitir paquete de evidencias al fiscal anticorrupción

**Nivel de Confianza:** 94% | **Calidad de Evidencia:** Alta | **Verificado en Blockchain:** ✓`;
  }

  if (q.includes("suspicious contract") || q.includes("contractor") || q.includes("contrato") || q.includes("sospechoso")) {
    return `## Análisis de Contratos Sospechosos

He identificado **4 contratos** con señales de alerta que requieren revisión inmediata:

### 1. Hospital Norte — Contrato #HC-2023-0041
- **Contratista:** BuildCorp S.A. | **Monto:** $8,000,000
- 🔴 Adenda no autorizada (+$920K, sin revisión del comité)
- 🔴 Sobrecosto del 18% sobre el presupuesto aprobado
- Puntaje de Riesgo: **89/100**

### 2. Carretera Sur — Contrato #SH-2022-0089
- **Contratista:** RoadMaster Inc. | **Monto:** $15,000,000
- 🟠 Contratista ganó 7 de 9 licitaciones recientes en la región
- 🔴 Pago duplicado detectado ($218K)
- Puntaje de Riesgo: **61/100**

### 3. Metro Línea 2 — Contrato #ML-2023-0012
- **Contratista:** MetroTrans Corp. | **Monto:** $45,000,000
- 🟠 31% del presupuesto ejecutado vs. 28% de avance físico
- 🟠 Retraso de 4 meses sin aplicación de penalidades
- Puntaje de Riesgo: **73/100**

### 4. Electrificación Rural — Contrato #RE-2023-0055
- **Contratista:** PowerGrid S.A. | **Monto:** $3,200,000
- 🔴 Conflicto de interés de directivo con comité de adquisiciones
- 🟠 Relaciones con subcontratistas no divulgadas
- Puntaje de Riesgo: **45/100**

**Valor Total Bajo Investigación:** $71,200,000
**Nivel de Confianza:** 91% | **Verificado en Blockchain:** ✓`;
  }

  if (q.includes("hospital norte") || q.includes("anomal")) {
    return `## Análisis Profundo de Anomalía — Construcción Hospital Norte

**ID de Proyecto:** HC-2023-0041 | **Puntaje de Riesgo:** 89/100 CRÍTICO

### Anomalía #1 — Sobrecosto +18%
- **Detectada:** 15 de enero de 2024
- **Tipo:** Financiero | **Severidad:** Crítica
- Presupuesto aprobado: $8,000,000 | Costo actual: $9,440,000
- Exceso: **$1,440,000** — sin autorización escrita encontrada
- Supera el umbral legal que requiere aprobación del Congreso

### Anomalía #2 — Modificación Presupuestal Sin Justificación
- **Detectada:** 12 de enero de 2024
- **Tipo:** Cumplimiento | **Severidad:** Crítica
- Adenda #3 del contrato añadió $920K en cambios de alcance
- Sin actas del comité técnico registradas
- Sin aviso público presentado (exigido legalmente para modificaciones >$500K)

### Anomalía #3 — Análisis de Brecha de Ejecución
- **Detectada:** 15 de enero de 2024 (en curso)
- Presupuesto ejecutado: **95%** | Avance físico: **72%**
- Brecha de **23 puntos porcentuales** — $1.84M sin explicación
- Fotos de inspección confirman estructuras incompletas

### Evidencia Blockchain:
- Transacción \`0x9f82ab7cd82e...\` — Pago $420K (Verificado ✓)
- Cruce con registro de facturas: 2 facturas sin coincidencia

### Acciones Recomendadas:
1. Congelamiento inmediato de pagos ($580K restantes)
2. Auditoría forense independiente
3. Inspección in situ por la unidad de control del Ministerio
4. Denuncia penal ante la Fiscalía General

**Calidad de Evidencia:** 95% | **Fondos Recuperables Estimados:** $2,360,000`;
  }

  if (q.includes("audit report") || q.includes("report") || q.includes("informe") || q.includes("reporte")) {
    return `## T1 2024 — Informe de Auditoría Autónoma
**Generado:** ${new Date().toLocaleDateString("es-PE", { dateStyle: "long" })} | **Confianza:** 92%

---

### Resumen Ejecutivo
GovWatch AI monitoreó **124 proyectos gubernamentales** que representan **$38.4M** en fondos públicos durante el T1 2024. El agente autónomo detectó **17 eventos de riesgo de corrupción** y previno pérdidas estimadas de **$4.8M**.

### Resumen del Portafolio
| Estado | Proyectos | Presupuesto |
|---|---|---|
| 🟢 Saludable | 89 | $18.2M |
| 🟡 En Revisión | 24 | $11.4M |
| 🟠 Advertencia | 8 | $6.8M |
| 🔴 Crítico | 3 | $2.0M |

### Hallazgos Críticos
1. **Hospital Norte** — Riesgo 89/100 — Irregularidades financieras $2.36M
2. **Metro Línea 2** — Riesgo 73/100 — Brecha cronograma/presupuesto $6.75M
3. **Carretera Sur** — Riesgo 61/100 — Irregularidades en adquisiciones $3.42M

### Impacto Financiero
- Fondos en riesgo identificados: **$12,530,000**
- Fraude prevenido (pagos congelados): **$4,800,000**
- Valor de investigaciones en curso: **$7,730,000**

### Verificación Blockchain
Las 1,247 transacciones procesadas este trimestre están registradas en el libro contable inmutable. El **98.7%** está completamente verificado.

### Rendimiento del Agente
- Auditorías completadas: 26,666
- Confianza promedio: 92%
- Disponibilidad del sistema: 99.97%
- Costo por auditoría: $0.18
- ROI público: **200x**

**Próxima Auditoría Completa Programada:** 1 de febrero de 2024 a las 00:00 UTC`;
  }

  if (q.includes("supplier") || q.includes("multiple") || q.includes("proveedor")) {
    return `## Informe de Inteligencia de Proveedores — Análisis de Contratistas Recurrentes

He identificado **3 proveedores** que aparecen en múltiples contratos con patrones de riesgo elevados:

### 🔴 RIESGO ALTO — RoadMaster Inc.
- Contratos ganados: **7 de 9** licitaciones públicas (Región Sur, 2022–2024)
- Valor total de contratos: **$34,500,000**
- Probabilidad estadística de competencia justa: **< 2.1%**
- Domicilios compartidos con 2 competidores (indicadores de empresas fantasma)
- Acción recomendada: Investigación por fraude en adquisiciones

### 🟠 RIESGO MEDIO — BuildCorp S.A.
- Contratos ganados: **4** proyectos del Ministerio de Salud (2021–2024)
- Valor total de contratos: **$22,800,000**
- Superposición de directivos con 1 funcionario del Ministerio (no divulgado)
- Modificaciones de contratos superan la línea base en promedio un 14%
- Acción recomendada: Revisión por conflicto de interés

### 🟠 RIESGO MEDIO — PowerGrid S.A.
- Contratos ganados: **3** proyectos del Ministerio de Energía
- Valor total de contratos: **$9,600,000**
- Miembro del directorio forma parte del comité de evaluación de adquisiciones
- 2 subcontratistas relacionados no declarados según la normativa
- Acción recomendada: Revisión del comité de ética + auditoría de divulgación

### Análisis de Red
El cruce con bases de datos de propiedad real revela una posible **red de propiedad común** que conecta RoadMaster Inc. y BuildCorp S.A. a través de una holding registrada en el extranjero.

**Evidencia Blockchain Preservada:** 12 registros de transacciones | **Confianza:** 88%`;
  }

  if (q.includes("spending") || q.includes("gasto") || q.includes("unusual") || q.includes("pattern")) {
    return `## Análisis de Patrones de Gasto Inusuales

El reconocimiento de patrones de IA ha marcado las siguientes anomalías financieras en el portafolio monitoreado:

### Patrón 1 — Pico de Pagos de Fin de Año
- **Proyectos afectados:** Hospital Norte, Carretera Sur
- Los pagos de dic. 2023 aumentaron **340%** sobre el promedio mensual
- 8 pagos procesados en los últimos 3 días del año fiscal
- Indicador clásico de fraude por agotamiento de presupuesto
- **Exposición:** $1,240,000

### Patrón 2 — Divergencia Avance-Ejecución
Proyectos donde el dinero fluye más rápido que el trabajo físico:
| Proyecto | Ejecutado | Físico | Brecha |
|---|---|---|---|
| Hospital Norte | 95% | 72% | 23% 🔴 |
| Metro Línea 2 | 31% | 28% | 3% 🟡 |
| Portal Ciudadano Digital | 91% | 85% | 6% 🟡 |

### Patrón 3 — Pagos en Números Redondos
- 14 pagos identificados como números exactamente redondos (ej. $500,000.00, $1,000,000.00)
- Las facturas de construcción real casi nunca usan números redondos
- Estadísticamente anómalo: probabilidad < 0.003%
- **Exposición:** $6,200,000

### Patrón 4 — Aprobaciones en Fin de Semana
- 6 pagos de alto valor ($420K–$920K) aprobados en sábados/domingos
- Los flujos normales de aprobación requieren quórum del comité (solo días hábiles)
- Los 6 evitaron la ventana estándar de revisión de 48h
- **Exposición:** $3,580,000

**Total de Gasto Inusual Marcado:** $11,020,000
**Nivel de Confianza:** 89% | **Registros Blockchain:** 23 transacciones marcadas`;
  }

  // Default response
  return `## Análisis GovWatch AI

Consulta recibida. Con base en los datos de monitoreo actuales sobre **124 proyectos gubernamentales** (${new Date().toLocaleDateString("es-PE", { dateStyle: "long" })}):

### Estado Actual del Sistema
- **17 eventos de riesgo activos** bajo investigación
- **3 alertas críticas** que requieren acción inmediata
- **$4.8M** en fraude prevenido este trimestre
- Confianza del sistema: **92%** | Disponibilidad: **99.97%**

### Prioridades Más Urgentes:
1. 🔴 **Hospital Norte** — Riesgo 89/100 — Congelamiento de pagos recomendado
2. 🟠 **Metro Línea 2** — Riesgo 73/100 — Investigación de brecha avance-presupuesto
3. 🟠 **Carretera Sur** — Riesgo 61/100 — Revisión de adquisiciones necesaria

### Próximas Acciones Sugeridas:
- Pídeme analizar un proyecto o contrato específico
- Solicita un informe de auditoría completo
- Consulta patrones de proveedores sospechosos
- Revisa los registros de verificación blockchain

Puedo analizar cualquier aspecto del portafolio monitoreado. ¿Qué deseas investigar?

**Confianza:** 92% | **Última Sincronización:** hace 2 minutos | **Blockchain:** ✓ Verificado`;
}
