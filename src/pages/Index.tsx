import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCards from "@/components/dashboard/KpiCards";
import PhaseTimeline from "@/components/dashboard/PhaseTimeline";
import StrategicCards from "@/components/dashboard/StrategicCards";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
        <DashboardHeader />
        <KpiCards />
        <PhaseTimeline />
        <StrategicCards />
        <footer className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            SESI SENAI — Tecnologias Digitais • Status Report gerado em 03/02/2026
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
