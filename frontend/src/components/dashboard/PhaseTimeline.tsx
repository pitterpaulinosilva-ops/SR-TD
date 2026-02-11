import { useState } from "react";
import {
  ChevronDown,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Briefcase,
  MoreVertical,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Activity, Phase, Status } from "@/types/timeline";
import { cn } from "@/lib/utils";

const statusConfig: Record<Status, { icon: typeof CheckCircle2; colorClass: string; bgClass: string; borderColor: string }> = {
  "Entregue": { icon: CheckCircle2, colorClass: "text-green-600", bgClass: "bg-green-50", borderColor: "border-green-200" },
  "Em andamento": { icon: Clock, colorClass: "text-blue-600", bgClass: "bg-blue-50", borderColor: "border-blue-200" },
  "Não iniciado": { icon: Circle, colorClass: "text-slate-400", bgClass: "bg-slate-100", borderColor: "border-slate-200" },
};

const ActivityItem = ({
  activity,
  onUpdate,
  onDelete
}: {
  activity: Activity;
  onUpdate: (activity: Activity) => void;
  onDelete: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Activity>({ ...activity });

  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
    toast.success("Atividade atualizada");
  };

  const config = statusConfig[activity.status] || statusConfig["Não iniciado"];
  const Icon = config.icon;

  if (isEditing) {
    return (
      <div className="p-3 bg-white rounded-lg border border-primary/20 shadow-sm animate-in fade-in space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Nome da Atividade</label>
          <Input
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            className="h-8"
            autoFocus
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Status</label>
            <Select
              value={editForm.status}
              onValueChange={(v: Status) => setEditForm({ ...editForm, status: v })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Não iniciado">Não iniciado</SelectItem>
                <SelectItem value="Em andamento">Em andamento</SelectItem>
                <SelectItem value="Entregue">Entregue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Data</label>
            <Input
              value={editForm.date || ""}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              className="h-8"
              placeholder="DD/MM/AAAA"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-7">Cancelar</Button>
          <Button size="sm" onClick={handleSave} className="h-7 bg-primary text-white">Salvar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex items-center justify-between p-3 rounded-lg bg-white border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={cn("p-1.5 rounded-full shrink-0", config.bgClass)}>
          <Icon className={cn("h-4 w-4", config.colorClass)} />
        </div>
        <span className="text-sm font-medium text-slate-700 truncate">{activity.name}</span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {activity.date && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            <Calendar className="h-3 w-3" />
            {activity.date}
          </div>
        )}

        <Badge variant="outline" className={cn("font-normal", config.bgClass, config.colorClass, config.borderColor)}>
          {activity.status}
        </Badge>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-32 p-1">
            <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs" onClick={() => setIsEditing(true)}>
              <Pencil className="h-3 w-3 mr-2" /> Editar
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
              <Trash2 className="h-3 w-3 mr-2" /> Excluir
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

const PhaseSection = ({
  phase,
  index,
  totalPhases,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onUpdatePhaseName,
  onDeletePhase
}: {
  phase: Phase;
  index: number;
  totalPhases: number;
  onAddActivity: (phaseId: string) => void;
  onUpdateActivity: (phaseId: string, activity: Activity) => void;
  onDeleteActivity: (phaseId: string, activityId: string) => void;
  onUpdatePhaseName: (phaseId: string, newName: string) => void;
  onDeletePhase: (phaseId: string) => void;
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameBuffer, setNameBuffer] = useState(phase.name);

  const completedInfo = phase.activities.reduce((acc, curr) => {
    if (curr.status === "Entregue") return { ...acc, completed: acc.completed + 1 };
    return acc;
  }, { completed: 0, total: phase.activities.length });

  const progress = completedInfo.total > 0
    ? Math.round((completedInfo.completed / completedInfo.total) * 100)
    : 0;

  const handleSaveName = () => {
    if (nameBuffer.trim()) {
      onUpdatePhaseName(phase.id, nameBuffer);
      setIsEditingName(false);
    }
  };

  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      {/* Vertical Connector Line */}
      <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-slate-200" />
      {index === totalPhases - 1 && <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-white h-full" />} {/* Hide line for last item */}

      {/* Node Circle */}
      <div className={cn(
        "absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-colors duration-300",
        progress === 100 ? "border-green-500 text-green-500" :
          progress > 0 ? "border-blue-500 text-blue-500" : "border-slate-300 text-slate-300"
      )}>
        <div className={cn("w-2 h-2 rounded-full",
          progress === 100 ? "bg-green-500" :
            progress > 0 ? "bg-blue-500" : "bg-slate-300"
        )} />
      </div>

      {/* Content Block */}
      <div className="space-y-4">
        {/* Phase Header */}
        <div className="flex items-center justify-between group/header">
          <div>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={nameBuffer}
                  onChange={(e) => setNameBuffer(e.target.value)}
                  className="h-8 font-semibold w-64"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                />
                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={handleSaveName}><Check className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setIsEditingName(false)}><X className="h-4 w-4" /></Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">{phase.name}</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/header:opacity-100 transition-opacity text-muted-foreground" onClick={() => { setNameBuffer(phase.name); setIsEditingName(true); }}>
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-3 mt-1">
              <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{progress}% Concluído</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeletePhase(phase.id)}
            className="text-muted-foreground hover:text-destructive opacity-0 group-hover/header:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Activities List */}
        <div className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-border/50">
          {phase.activities.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm italic">
              Nenhuma atividade nesta fase.
            </div>
          ) : (
            phase.activities.map(activity => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                onUpdate={(updated) => onUpdateActivity(phase.id, updated)}
                onDelete={() => onDeleteActivity(phase.id, activity.id)}
              />
            ))
          )}

          <Button
            variant="ghost"
            className="w-full border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary h-10 mt-2"
            onClick={() => onAddActivity(phase.id)}
          >
            <Plus className="h-4 w-4 mr-2" /> Adicionar Atividade
          </Button>
        </div>
      </div>
    </div>
  );
}


interface PhaseTimelineProps {
  phases: Phase[];
  onAddActivity: (phaseId: string) => void;
  onUpdateActivity: (phaseId: string, activity: Activity) => void;
  onDeleteActivity: (phaseId: string, activityId: string) => void;
  onAddPhase: () => void;
  onUpdatePhaseName: (phaseId: string, newName: string) => void;
  onDeletePhase: (phaseId: string) => void;
}

const PhaseTimeline = ({
  phases,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onAddPhase,
  onUpdatePhaseName,
  onDeletePhase
}: PhaseTimelineProps) => {
  return (
    <section className="bg-card rounded-xl border border-border shadow-sm p-6 md:p-8 animate-fade-in relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Timeline de Execução</h2>
            <p className="text-xs text-muted-foreground">Ciclo de vida e entregas do projeto</p>
          </div>
        </div>
        <Button onClick={onAddPhase} className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20">
          <Plus className="h-4 w-4 mr-2" /> Nova Fase
        </Button>
      </div>

      <div className="relative z-10 pl-2">
        {phases.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-foreground">Projeto sem fases</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Comece adicionando a primeira fase (ex: Planejamento) para organizar suas atividades.</p>
            <Button onClick={onAddPhase}>Criar Primeira Fase</Button>
          </div>
        ) : (
          phases.map((phase, i) => (
            <PhaseSection
              key={phase.id}
              phase={phase}
              index={i}
              totalPhases={phases.length}
              onAddActivity={onAddActivity}
              onUpdateActivity={onUpdateActivity}
              onDeleteActivity={onDeleteActivity}
              onUpdatePhaseName={onUpdatePhaseName}
              onDeletePhase={onDeletePhase}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default PhaseTimeline;
