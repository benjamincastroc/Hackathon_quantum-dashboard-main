import RiskAnalytics from "@/components/RiskAnalytics";
import AnomaliesPanel from "@/components/AnomaliesPanel";
import SurvivalEngine from "@/components/SurvivalEngine";

export default function RiskPage() {
  return (
    <>
      <div className="animate-enter">
        <h1 className="text-lg sm:text-xl font-bold text-white">Análisis de Riesgo</h1>
        <p className="text-xs text-slate-500 mt-0.5">Puntuación de riesgo con IA y detección de anomalías</p>
      </div>
      <RiskAnalytics />
      <AnomaliesPanel />
      <SurvivalEngine />
    </>
  );
}
