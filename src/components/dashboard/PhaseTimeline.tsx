import { useState } from "react";
import { ChevronDown, CheckCircle2, Clock, Circle, AlertCircle, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Activity, Phase, Status } from "@/types/timeline";

const statusConfig: Record<Status, { icon: typeof CheckCircle2; colorClass: string; bgClass: string }> = {
  "Entregue": { icon: CheckCircle2, colorClass: "text-success", bgClass: "bg-success/10" },
  "Em andamento": { icon: Clock, colorClass: "text-warning", bgClass: "bg-warning/10" },
  "Não iniciado": { icon: Circle, colorClass: "text-muted-foreground", bgClass: "bg-muted" },
};

const PhaseCard = ({
  phase,
  index,
  onUpdateActivity,
  onAddActivity,
  onDeleteActivity
}: {
  phase: Phase;
  index: number;
  onUpdateActivity: (phaseId: string, activity: Activity) => void;
  onAddActivity: (phaseId: string) => void;
  onDeleteActivity: (phaseId: string, activityId: string) => void;
}) => {
  const [open, setOpen] = useState(index === 0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Activity | null>(null);

  // Calculate progress based on activities
  const completedActivities = phase.activities.filter(a => a.status === "Entregue").length;
  const totalActivities = phase.activities.length;
  const progressPercentage = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  const startEditing = (activity: Activity) => {
    setEditingId(activity.id);
    setEditForm({ ...activity });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEditing = () => {
    if (editForm) {
      onUpdateActivity(phase.id, editForm);
      setEditingId(null);
      setEditForm(null);
      toast.success("Atividade atualizada com sucesso!");
    }
  };

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
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {progressPercentage}%
            </span>
            <span className="text-xs text-muted-foreground">
              ({phase.activities.length} atividades)
            </span>
          </div>
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
            style={{ width: `${Math.max(progressPercentage, 2)}%` }}
          />
        </div>
      </div>

      {open && (
        <div className="p-5 pt-4 space-y-2">
          {phase.activities.map((activity) => {
            const isEditing = editingId === activity.id;

            if (isEditing && editForm) {
              return (
                <div key={activity.id} className="flex flex-col gap-3 p-4 rounded-lg bg-muted/50 border border-border animate-in fade-in zoom-in-95">
                  <div className="grid gap-2">
                    <label className="text-xs font-medium">Nome da Atividade</label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="h-8"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                      <label className="text-xs font-medium">Status</label>
                      <Select
                        value={editForm.status}
                        onValueChange={(value: Status) => setEditForm({ ...editForm, status: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Não iniciado">Não iniciado</SelectItem>
                          <SelectItem value="Em andamento">Em andamento</SelectItem>
                          <SelectItem value="Entregue">Entregue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-medium">Data (Opcional)</label>
                      <Input
                        value={editForm.date || ""}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        placeholder="DD/MM/AAAA"
                        className="h-8"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-1">
                    <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-7 px-2">
                      <X className="h-3 w-3 mr-1" /> Cancelar
                    </Button>
                    <Button size="sm" onClick={saveEditing} className="h-7 px-2">
                      <Check className="h-3 w-3 mr-1" /> Salvar
                    </Button>
                  </div>
                </div>
              );
            }

            const config = statusConfig[activity.status];
            const Icon = config.icon;

            return (
              <div
                key={activity.id}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`p-1 rounded-md shrink-0 ${config.bgClass}`}>
                    <Icon className={`h-4 w-4 ${config.colorClass}`} />
                  </div>
                  <span className="text-sm text-card-foreground truncate">{activity.name}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {activity.date && (
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                  )}
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.bgClass} ${config.colorClass}`}>
                    {activity.status}
                  </span>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => startEditing(activity)}
                    >
                      <Pencil className="h-3 w-3 text-muted-foreground hover:text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-destructive/10"
                      onClick={() => onDeleteActivity(phase.id, activity.id)}
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          <Button
            variant="outline"
            className="w-full mt-2 border-dashed text-muted-foreground hover:text-primary hover:border-primary/50"
            onClick={() => onAddActivity(phase.id)}
          >
            <Plus className="h-4 w-4 mr-2" /> Adicionar Atividade
          </Button>
        </div>
      )}
    </div>
  );
};

interface PhaseTimelineProps {
  phases: Phase[];
  onAddActivity: (phaseId: string) => void;
  onUpdateActivity: (phaseId: string, activity: Activity) => void;
  onDeleteActivity: (phaseId: string, activityId: string) => void;
}

const PhaseTimeline = ({ phases, onAddActivity, onUpdateActivity, onDeleteActivity }: PhaseTimelineProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground font-display">
          Progresso por Contexto de Negócio
        </h2>
      </div>
      <div className="space-y-3">
        {phases.map((phase, i) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            index={i}
            onAddActivity={onAddActivity}
            onUpdateActivity={onUpdateActivity}
            onDeleteActivity={onDeleteActivity}
          />
        ))}
      </div>
    </section>
  );
};

export default PhaseTimeline;
