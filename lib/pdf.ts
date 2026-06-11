// pdf-parse es CommonJS — require evita el problema de default export
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string; numpages: number }>;

export interface PdfResult {
  content: string;
  pages: number;
  sizeBytes: number;
}

export function isPdfUrl(url: string): boolean {
  return url.toLowerCase().includes(".pdf") || url.toLowerCase().includes("/pdf/");
}

export async function extractPdf(url: string): Promise<PdfResult | null> {
  console.log("[PDF] Descargando:", url);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 GovWatch-AI-Auditor/1.0",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn("[PDF] HTTP error:", res.status, url);
      return null;
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("pdf") && !url.toLowerCase().includes(".pdf")) {
      console.warn("[PDF] Content-Type no es PDF:", contentType);
      return null;
    }

    const buffer = await res.arrayBuffer();
    const sizeBytes = buffer.byteLength;
    console.log("[PDF] Descargado:", (sizeBytes / 1024).toFixed(1), "KB");

    const data = await pdfParse(Buffer.from(buffer));
    const content = data.text.replace(/\s+/g, " ").trim();

    console.log("[PDF] Extraído:", data.numpages, "páginas,", content.length, "chars");
    return { content, pages: data.numpages, sizeBytes };
  } catch (err) {
    console.error("[PDF] Error procesando", url, "→", err instanceof Error ? err.message : err);
    return null;
  }
}
