"use client";
import { useState, useEffect } from "react";
import {
  loadInvestigation,
  saveInvestigation,
  type InvestigationData,
} from "@/lib/investigation-store";

export function useInvestigationData(): InvestigationData | null {
  const [data, setData] = useState<InvestigationData | null>(null);

  useEffect(() => {
    // 1. Carga inmediata desde localStorage (sin esperar red)
    const cached = loadInvestigation();
    if (cached) {
      setData(cached);
    } else {
      // 2. Si no hay caché, busca la última investigación en Supabase
      fetch("/api/investigations/latest")
        .then((r) => r.json())
        .then(({ data: inv }: { data: InvestigationData | null }) => {
          if (inv) {
            saveInvestigation(inv); // guarda en localStorage para próximas cargas
            setData(inv);
          }
        })
        .catch(() => {}); // fallo silencioso — sin datos es OK
    }

    // 3. Escucha actualizaciones en tiempo real (cuando el agente termina)
    const handler = (e: Event) => {
      setData((e as CustomEvent<InvestigationData | null>).detail);
    };
    window.addEventListener("govwatch:investigation", handler);
    return () => window.removeEventListener("govwatch:investigation", handler);
  }, []);

  return data;
}
