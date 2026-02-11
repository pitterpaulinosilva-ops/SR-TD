import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Layers } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCards from "@/components/dashboard/KpiCards";
import PhaseTimeline from "@/components/dashboard/PhaseTimeline";
import StrategicCards from "@/components/dashboard/StrategicCards";
import { Activity, Item } from "@/types/timeline";
import { Program } from "@/types/program";
import { programService } from "@/services/programService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const ProgramView = () => {
    const { id } = useParams<{ id: string }>();
    const [program, setProgram] = useState<Program | null>(null);

    useEffect(() => {
        if (id) {
            const data = programService.getById(id);
            if (data) {
                // Ensure arrays are initialized if older data exists
                const safeData = {
                    ...data,
                    phases: data.phases || [],
                    risks: data.risks || [],
                    lessons: data.lessons || []
                };
                setProgram(safeData);
            } else {
                toast.error("Programa não encontrado");
            }
        }
    }, [id]);

    if (!program) {
        return (
            <Layout>
                <div className="flex h-[50vh] items-center justify-center">
                    <div className="text-center space-y-4">
                        <p className="text-muted-foreground text-lg">Carregando programa...</p>
                        <Link to="/">
                            <Button variant="outline">Voltar para Dashboard</Button>
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    // Calculate total progress
    const allActivities = program.phases.flatMap(p => p.activities);
    const completedActivities = allActivities.filter(a => a.status === "Entregue").length;
    const totalProgress = allActivities.length > 0
        ? (completedActivities / allActivities.length) * 100
        : 0;

    const updateProgram = (updatedProgram: Program) => {
        setProgram(updatedProgram);
        programService.update(updatedProgram.id, updatedProgram);
    };

    const handleUpdateHeader = (data: {
        projectName: string;
        objective: string;
        directorate: string;
        macroprocess: string;
        process: string;
        subprocess: string;
        processOwner: string;
        productOwner: string;
    }) => {
        // Update title to match projectName
        updateProgram({
            ...program,
            ...data,
            title: data.projectName,
        });
        toast.success("Cabeçalho atualizado");
    };

    const handleUpdateRisks = (items: Item[]) => {
        updateProgram({ ...program, risks: items });
    };

    const handleUpdateLessons = (items: Item[]) => {
        updateProgram({ ...program, lessons: items });
    };

    // --- Phase & Activity Handlers (Identical to ReportView) ---

    const handleAddActivity = (phaseId: string) => {
        const newActivity: Activity = {
            id: Math.random().toString(36).substr(2, 9),
            name: "Nova Atividade",
            status: "Não iniciado",
        };

        const updatedPhases = program.phases.map(phase => {
            if (phase.id === phaseId) {
                return {
                    ...phase,
                    activities: [...phase.activities, newActivity]
                };
            }
            return phase;
        });

        updateProgram({ ...program, phases: updatedPhases });
        toast("Nova atividade adicionada");
    };

    const handleUpdateActivity = (phaseId: string, updatedActivity: Activity) => {
        const updatedPhases = program.phases.map(phase => {
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

        updateProgram({ ...program, phases: updatedPhases });
    };

    const handleDeleteActivity = (phaseId: string, activityId: string) => {
        const updatedPhases = program.phases.map(phase => {
            if (phase.id === phaseId) {
                return {
                    ...phase,
                    activities: phase.activities.filter(act => act.id !== activityId)
                };
            }
            return phase;
        });

        updateProgram({ ...program, phases: updatedPhases });
        toast.success("Atividade removida");
    };

    const handleAddPhase = () => {
        const newPhase = {
            id: Math.random().toString(36).substr(2, 9),
            name: "Nova Fase",
            progress: 0,
            activities: []
        };
        updateProgram({ ...program, phases: [...program.phases, newPhase] });
        toast.success("Nova fase de programa adicionada");
    };

    const handleUpdatePhaseName = (phaseId: string, newName: string) => {
        const updatedPhases = program.phases.map(p =>
            p.id === phaseId ? { ...p, name: newName } : p
        );
        updateProgram({ ...program, phases: updatedPhases });
        toast.success("Nome da fase atualizado");
    };

    const handleDeletePhase = (phaseId: string) => {
        if (confirm("Tem certeza que deseja excluir esta fase e todas as suas atividades?")) {
            const updatedPhases = program.phases.filter(p => p.id !== phaseId);
            updateProgram({ ...program, phases: updatedPhases });
            toast.success("Fase removida");
        }
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
                    <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <Layers className="h-3 w-3" /> Programa Estratégico
                    </div>
                </div>

                <DashboardHeader
                    projectName={program.projectName || program.title}
                    objective={program.objective}
                    directorate={program.directorate || ""}
                    macroprocess={program.macroprocess || ""}
                    process={program.process || ""}
                    subprocess={program.subprocess || ""}
                    processOwner={program.processOwner || ""}
                    productOwner={program.productOwner || ""}
                    onUpdate={handleUpdateHeader}
                />

                <KpiCards totalProgress={totalProgress} />

                <PhaseTimeline
                    phases={program.phases}
                    onAddActivity={handleAddActivity}
                    onUpdateActivity={handleUpdateActivity}
                    onDeleteActivity={handleDeleteActivity}
                    onAddPhase={handleAddPhase}
                    onUpdatePhaseName={handleUpdatePhaseName}
                    onDeletePhase={handleDeletePhase}
                />

                <StrategicCards
                    risks={program.risks}
                    lessons={program.lessons}
                    onUpdateRisks={handleUpdateRisks}
                    onUpdateLessons={handleUpdateLessons}
                />
            </div>
        </Layout>
    );
};

export default ProgramView;
