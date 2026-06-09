import RiskAnalytics from "@/components/RiskAnalytics";
import ProjectsTable from "@/components/ProjectsTable";
import AnomaliesPanel from "@/components/AnomaliesPanel";

export default function ReportsPage() {
  return (
    <>
      <div className="animate-enter">
        <h1 className="text-lg sm:text-xl font-bold text-white">Audit Reports</h1>
        <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit documentation and findings</p>
      </div>
      <RiskAnalytics />
      <ProjectsTable />
      <AnomaliesPanel />
    </>
  );
}
