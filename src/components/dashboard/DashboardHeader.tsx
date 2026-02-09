import { useState } from "react";
import { Check, Edit2, LayoutDashboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DashboardHeaderProps {
  projectName?: string;
  objective?: string;
  directorate?: string;
  onUpdate?: (data: { projectName: string; objective: string; directorate: string }) => void;
  readOnly?: boolean;
}

const DashboardHeader = ({
  projectName = "Novo Sistema de Saúde",
  objective = "Implementação da nova plataforma...",
  directorate = "",
  onUpdate,
  readOnly = false
}: DashboardHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ projectName, objective, directorate });

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ projectName, objective, directorate });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <header className="flex flex-col gap-4 p-6 bg-card rounded-xl border border-border shadow-card animate-fade-in w-full">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Nome do Projeto</label>
                <Input
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="text-lg font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Diretoria</label>
                <Input
                  value={formData.directorate}
                  onChange={(e) => setFormData({ ...formData, directorate: e.target.value })}
                  placeholder="Ex: Diretoria de Saúde e Segurança"
                  className="text-base"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Objetivo</label>
              <Textarea
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-card rounded-xl border border-border shadow-card animate-fade-in relative group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <LayoutDashboard className="h-8 w-8 text-primary" />
        </div>
        <div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {directorate || "Diretoria não definida"}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground tracking-tight">
              {projectName}
            </h1>
          </div>
          <p className="text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            {objective || "Sem objetivo definido."}
          </p>
        </div>
      </div>

      {!readOnly && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => {
            setFormData({ projectName, objective, directorate: directorate || "" });
            setIsEditing(true);
          }}
        >
          <Edit2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      )}

      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-medium text-muted-foreground">Status Geral</span>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </span>
          <span className="text-sm font-bold text-success">Em Dia</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
