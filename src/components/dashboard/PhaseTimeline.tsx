import { useState } from "react";
import { ChevronDown, CheckCircle2, Clock, Circle, AlertCircle } from "lucide-react";

type Status = "Entregue" | "Em andamento" | "Não iniciado";

interface Activity {
  name: string;
  status: Status;
  date?: string;
}

interface Phase {
  name: string;
  progress: number;
  activities: Activity[];
}

const phases: Phase[] = [
  {
    name: "Fase 1 — Prospecção e Planejamento",
    progress: 10,
    activities: [
      { name: "Levantamento de Requisitos e Prospecção", status: "Entregue", date: "23/01/2025" },
      { name: "Análise de Aderência", status: "Entregue", date: "28/03/2025" },
      { name: "Termo de Solicitação de Contratação (TSC)", status: "Entregue", date: "01/12/2025" },
      { name: "Aguardar Processo Licitatório", status: "Em andamento" },
      { name: "Prova de Conceito e Contratação", status: "Não iniciado" },
    ],
  },
  {
    name: "Fase 2 — Execução",
    progress: 0,
    activities: [
      { name: "Kick-off do Projeto", status: "Não iniciado" },
      { name: "Implantar Solução", status: "Não iniciado" },
    ],
  },
  {
    name: "Fase 3 — Encerramento",
    progress: 0,
    activities: [
      { name: "Operação Assistida", status: "Não iniciado" },
    ],
  },
];

const statusConfig: Record<Status, { icon: typeof CheckCircle2; colorClass: string; bgClass: string }> = {
  "Entregue": { icon: CheckCircle2, colorClass: "text-success", bgClass: "bg-success/10" },
  "Em andamento": { icon: Clock, colorClass: "text-warning", bgClass: "bg-warning/10" },
  "Não iniciado": { icon: Circle, colorClass: "text-muted-foreground", bgClass: "bg-muted" },
};

const PhaseCard = ({ phase, index }: { phase: Phase; index: number }) => {
  const [open, setOpen] = useState(index === 0);

  return (
    <div
      className="bg-card rounded-xl border border-border shadow-card overflow-hidden animate-fade-in"
      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-card-foreground text-left">{phase.name}</h3>
          </div>
          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {phase.progress}%
          </span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Progress bar */}
      <div className="px-5">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary rounded-full transition-all duration-700"
            style={{ width: `${Math.max(phase.progress, 2)}%` }}
          />
        </div>
      </div>

      {open && (
        <div className="p-5 pt-4 space-y-2">
          {phase.activities.map((activity) => {
            const config = statusConfig[activity.status];
            const Icon = config.icon;
            return (
              <div
                key={activity.name}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-md ${config.bgClass}`}>
                    <Icon className={`h-4 w-4 ${config.colorClass}`} />
                  </div>
                  <span className="text-sm text-card-foreground">{activity.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {activity.date && (
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                  )}
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.bgClass} ${config.colorClass}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const PhaseTimeline = () => {
  return (
    <section>
      <h2 className="text-lg font-bold text-foreground mb-4 font-display">
        Progresso por Contexto de Negócio
      </h2>
      <div className="space-y-3">
        {phases.map((phase, i) => (
          <PhaseCard key={phase.name} phase={phase} index={i} />
        ))}
      </div>
    </section>
  );
};

export default PhaseTimeline;
