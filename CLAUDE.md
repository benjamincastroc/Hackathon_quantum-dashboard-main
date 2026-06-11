# GovWatch AI — GovAnti-Corruption Solutions AI

## Overview
Premium enterprise SaaS platform for government anti-corruption monitoring. Combines autonomous AI agents, real-time web investigation, blockchain document fingerprinting, continuous auditing, risk detection, and public project monitoring.

**Idioma:** Toda la UI, prompts del agente y respuestas del chat están en **español**.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS — dark theme, glassmorphism
- **Charts**: Recharts (AreaChart, PieChart, BarChart)
- **Icons**: lucide-react
- **AI Agent & Chat**: Groq API (`llama-3.3-70b-versatile`)
- **Web Search**: Tavily API — búsquedas restringidas a dominios gov oficiales
- **Database**: Supabase (PostgreSQL) — investigaciones y documentos
- **Blockchain**: Syscoin NEVM mainnet (chain 57) via ethers.js v6
- **PDF Extraction**: pdf-parse — descarga y extrae texto completo de PDFs

## Dev Commands
```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Environment Variables (.env.local)
```
GROQ_API_KEY          # console.groq.com
TAVILY_API_KEY        # app.tavily.com (1,000 búsquedas/mes gratis)
SUPABASE_URL          # https://dfbsyhprpnfeizmmvxtx.supabase.co
SUPABASE_SECRET_KEY   # sb_secret_...
SYSCOIN_PRIVATE_KEY   # wallet privada para firmar txs en Syscoin NEVM
SYSCOIN_ADDRESS       # 0xaA8c016C8Dad7C0791155D4530E97381840fAc5e
```

## Architecture

### Dashboard (Single-Page Section Switching)
`app/page.tsx` renderiza secciones según `activeSection` state. Sin routing Next.js entre secciones — navegación client-side via `SectionContent` switch y `Sidebar`.

```
User clicks nav item → Sidebar calls onSectionChange(section) → page.tsx re-renders SectionContent
```

### Agente Investigador (Pipeline completo)
```
Usuario ingresa proyecto
  → POST /api/agent
  → Loop Groq (≥3 búsquedas forzadas con tool_choice:"required")
  → Tavily con include_domains=[portales gov] (fallback sin restricción si 0 resultados)
  → Detecta URLs .pdf → descarga → extrae texto completo con pdf-parse
  → Calcula SHA-256 de cada fuente
  → Guarda en Supabase: investigations + documents
  → Retorna: informe + fuentes con sha256 + investigationId

Usuario clica "Sellar en Syscoin"
  → POST /api/stamp { documentId }
  → stampOnSyscoin(sha256) → tx en Syscoin NEVM mainnet
  → Retorna txHash inmediatamente (sin esperar confirmación)
  → Guarda tx_hash + stamped_at en Supabase
```

## File Structure
```
app/
├── globals.css           # Global styles, scrollbar, animations
├── globals.css.d.ts      # CSS module type declaration
├── layout.tsx            # Root layout — fonts, metadata, dark class
├── page.tsx              # Main dashboard (SectionContent switch + TopBar)
└── api/
    ├── agent/route.ts    # Agente investigador: Groq loop + Tavily + PDF + Supabase
    ├── chat/route.ts     # Chat anticorrupción (solo responde temas de auditoría)
    └── stamp/route.ts    # Sella SHA-256 de documento en Syscoin NEVM

components/
├── InvestigatorAgent.tsx # HERO — agente investigador con SHA-256 y botón Sellar en Syscoin
├── Sidebar.tsx           # Nav izquierdo — exporta navItems[], collapse & mobile
├── KPICards.tsx          # 6 tarjetas KPI con tendencias
├── RiskAnalytics.tsx     # Gráfico de evolución de riesgo
├── ProjectsTable.tsx     # Proyectos gubernamentales con barras de progreso
├── AnomaliesPanel.tsx    # Lista de anomalías de corrupción detectadas
├── BlockchainPanel.tsx   # Registro blockchain de auditoría (lazy-loaded, ssr:false)
├── AutonomousAgent.tsx   # Módulos del agente IA y estado en vivo
├── AIChatAssistant.tsx   # Asistente de auditoría estilo ChatGPT
├── AgentTreasury.tsx     # Modelo de sostenibilidad económica
├── SurvivalEngine.tsx    # Grid de 5 reglas de inteligencia
├── ContractsPanel.tsx    # Tabla de contratos gubernamentales
├── SuppliersPanel.tsx    # Puntuaciones de cumplimiento de proveedores
├── PaymentsPanel.tsx     # Transacciones de pago y estadísticas
├── AlertsPanel.tsx       # Alertas del sistema por severidad
└── SettingsPanel.tsx     # Toggles de notificaciones, seguridad y privacidad

lib/
├── data.ts        # Mock data (proyectos, anomalías, blockchain, chat)
├── utils.ts       # cn(), formatCurrency(), getRiskColor()
├── supabase.ts    # Cliente Supabase (server-side, secret key)
├── blockchain.ts  # sha256() + stampOnSyscoin() → Syscoin NEVM mainnet
└── pdf.ts         # isPdfUrl() + extractPdf() → descarga y extrae texto de PDFs

scripts/
├── supabase-schema.sql   # DDL para crear tablas (investigations + documents)
└── generate-wallet.mjs   # Genera wallet Syscoin NEVM

global.d.ts        # Global TypeScript declarations
```

## Navigation Sections (navItems en Sidebar.tsx — etiquetas en español)
| Section key    | Label                | Badge     | Componente(s)                                                     |
|----------------|----------------------|-----------|-------------------------------------------------------------------|
| `dashboard`    | Tablero              | —         | KPI, Risk, Projects, Anomalies, Blockchain, Agent, Chat, Survival, Treasury |
| `projects`     | Proyectos            | `124`     | KPI + ProjectsTable                                               |
| `contracts`    | Contratos            | —         | ContractsPanel                                                    |
| `suppliers`    | Proveedores          | —         | SuppliersPanel                                                    |
| `payments`     | Pagos                | —         | PaymentsPanel                                                     |
| `risk`         | Análisis de Riesgo   | —         | RiskAnalytics + Anomalies + Survival                              |
| `blockchain`   | Blockchain           | —         | BlockchainPanel + AgentTreasury                                   |
| `reports`      | Informes de Auditoría| —         | RiskAnalytics + Projects + Anomalies                              |
| `agent`        | Agente Autónomo      | —         | **InvestigatorAgent** + AutonomousAgent + Chat + Treasury         |
| `alerts`       | Alertas              | `3` (red) | AlertsPanel                                                       |
| `settings`     | Configuración        | —         | SettingsPanel                                                     |

## Supabase Schema
```sql
CREATE TABLE investigations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  report TEXT,
  steps JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  content TEXT,          -- Texto completo (PDF extraído o snippet Tavily)
  sha256 TEXT,           -- SHA-256 del contenido completo
  is_pdf BOOLEAN DEFAULT FALSE,
  pdf_pages INTEGER,
  pdf_size_bytes BIGINT,
  tx_hash TEXT,          -- Hash de tx en Syscoin (null hasta sellar)
  block_number BIGINT,
  stamped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Dominios Gov Restringidos (Tavily include_domains)
```
gob.pe, contraloria.gob.pe, osce.gob.pe, seace.gob.pe, mef.gob.pe,
transparencia.gob.pe, datosabiertos.gob.pe, invierte.gob.pe, perucompras.gob.pe,
ojo-publico.com, idl-reporteros.pe, occrp.org, opencontracting.org, worldbank.org, iadb.org
```
Si una búsqueda retorna 0 resultados, el agente reintenta sin restricción de dominio.

## Design System
| Token       | Value                           | Uso                 |
|-------------|---------------------------------|---------------------|
| Background  | `#060711`                       | Fondo de página     |
| Surface     | `#0a0c18`                       | Sidebar             |
| Card        | `#0d1117` + `border-white/8`    | Tarjetas            |
| Glass card  | `rgba(16,18,32,0.8)` + blur     | Tarjetas flotantes  |
| Primary     | `#3b82f6`                       | Azul — acento       |
| Cyan        | `#06b6d4`                       | Acento secundario   |
| Emerald     | `#10b981`                       | Éxito / saludable   |
| Orange      | `#f97316`                       | Advertencia         |
| Red         | `#ef4444`                       | Crítico / peligro   |
| Yellow      | `#eab308`                       | Riesgo medio        |
| Text        | `#f1f5f9`                       | Texto principal     |
| Muted       | `#64748b`                       | Texto secundario    |

## Config Gotchas
- `postcss.config.js` → CommonJS (`module.exports`), NO ESM export default
- `next.config.mjs` (no `.ts`)
- `pdf-parse` es CommonJS → usar `require()`, NO `import default`
- `BigInt(0)` en lugar de `0n` (target ES < 2020 no soporta BigInt literals)
- Groq tools type: `Groq.Chat.ChatCompletionTool[]` (no `CompletionCreateParams.Tool[]`)
- Syscoin NEVM **mainnet** (chain 57, rpc.syscoin.org) — el faucet del Discord envía en mainnet, no en testnet Tanenbaum
- El stamp retorna `txHash` inmediatamente sin `tx.wait()` para evitar timeout de 60s

## Notes
- `BlockchainPanel` se importa dinámicamente con `ssr: false` para evitar hydration issues.
- `Sidebar.tsx` exporta el componente default y `navItems` (named export).
- El directorio `src/` contiene la estructura legacy React/Vite — **no es la app activa**.
- ESLint configurado en `.eslintrc.json`.
