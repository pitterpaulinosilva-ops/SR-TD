import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCards from "@/components/dashboard/KpiCards";
import PhaseTimeline from "@/components/dashboard/PhaseTimeline";
import StrategicCards from "@/components/dashboard/StrategicCards";
import { Activity, Report, Item } from "@/types/timeline";
import { reportService } from "@/services/reportService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const ReportView = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (id) {
      const data = reportService.getById(id);
      if (data) {
        setReport(data);
      } else {
        toast.error("Relatório não encontrado");
      }
    }
  }, [id]);

  if (!report) {
    return (
      <Layout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground text-lg">Carregando relatório...</p>
            <Link to="/">
              <Button variant="outline">Voltar para Dashboard</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate total progress
  const allActivities = report.phases.flatMap(p => p.activities);
  const completedActivities = allActivities.filter(a => a.status === "Entregue").length;
  const totalProgress = allActivities.length > 0
    ? (completedActivities / allActivities.length) * 100
    : 0;

  const updateReport = (updatedReport: Report) => {
    setReport(updatedReport);
    reportService.update(updatedReport.id, updatedReport);
  };

  const handleUpdateHeader = (data: { projectName: string; objective: string; directorate: string }) => {
    // Update title to match projectName so it shows up correctly in the Home list
    updateReport({
      ...report,
      ...data,
      title: data.projectName,
      directorate: data.directorate
    });
    toast.success("Cabeçalho atualizado");
  };

  const handleUpdateRisks = (items: Item[]) => {
    updateReport({ ...report, risks: items });
  };

  const handleUpdateLessons = (items: Item[]) => {
    updateReport({ ...report, lessons: items });
  };

  const handleAddActivity = (phaseId: string) => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Nova Atividade",
      status: "Não iniciado",
    };

    const updatedPhases = report.phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          activities: [...phase.activities, newActivity]
        };
      }
      return phase;
    });

    updateReport({ ...report, phases: updatedPhases });
    toast("Nova atividade adicionada");
  };

  const handleUpdateActivity = (phaseId: string, updatedActivity: Activity) => {
    const updatedPhases = report.phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          activities: phase.activities.map(act =>
            act.id === updatedActivity.id ? updatedActivity : act
          )
        };
      }
      return phase;
    });

    updateReport({ ...report, phases: updatedPhases });
  };

  const handleDeleteActivity = (phaseId: string, activityId: string) => {
    const updatedPhases = report.phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          activities: phase.activities.filter(act => act.id !== activityId)
        };
      }
      return phase;
    });

    updateReport({ ...report, phases: updatedPhases });
    toast.success("Atividade removida");
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4 mb-2">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1 pl-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" /> Voltar para Lista
            </Button>
          </Link>
        </div>

        <DashboardHeader
          projectName={report.projectName}
          objective={report.objective}
          directorate={report.directorate}
          onUpdate={handleUpdateHeader}
        />

        <KpiCards totalProgress={totalProgress} />

        <PhaseTimeline
          phases={report.phases}
          onAddActivity={handleAddActivity}
          onUpdateActivity={handleUpdateActivity}
          onDeleteActivity={handleDeleteActivity}
        />

        <StrategicCards
          risks={report.risks}
          lessons={report.lessons}
          onUpdateRisks={handleUpdateRisks}
          onUpdateLessons={handleUpdateLessons}
        />
      </div>
    </Layout>
  );
};

export default ReportView;
