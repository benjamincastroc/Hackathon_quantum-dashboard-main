import KPICards from "@/components/KPICards";
import ProjectsTable from "@/components/ProjectsTable";

export default function ProjectsPage() {
  return (
    <>
      <div className="animate-enter">
        <h1 className="text-lg sm:text-xl font-bold text-white">Proyectos</h1>
        <p className="text-xs text-slate-500 mt-0.5">Proyectos gubernamentales monitoreados por el agente IA</p>
      </div>
      <KPICards />
      <ProjectsTable />
    </>
  );
}
