import { useState } from "react";
import { Check, Edit2, LayoutDashboard, X, GitBranch, MapPin, User, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  projectName?: string;
  objective?: string;
  directorate?: string;
  macroprocess?: string;
  process?: string;
  subprocess?: string;
  processOwner?: string;
  productOwner?: string;
  onUpdate?: (data: {
    projectName: string;
    objective: string;
    directorate: string;
    macroprocess: string;
    process: string;
    subprocess: string;
    processOwner: string;
    productOwner: string;
  }) => void;
  readOnly?: boolean;
}

const DashboardHeader = ({
  projectName = "Novo Projeto",
  objective = "",
  directorate = "",
  macroprocess = "",
  process = "",
  subprocess = "",
  processOwner = "",
  productOwner = "",
  onUpdate,
  readOnly = false
}: DashboardHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    projectName,
    objective,
    directorate,
    macroprocess,
    process,
    subprocess,
    processOwner,
    productOwner
  });

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ projectName, objective, directorate, macroprocess, process, subprocess, processOwner, productOwner });
    setIsEditing(false);
  };

  return (
    isEditing ? (
      <div className="bg-card rounded-lg border border-border shadow-sm animate-fade-in overflow-hidden">
        <div className="bg-muted/30 px-6 py-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Edit2 className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Editar Informações do Projeto</h3>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8">
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} className="h-8 bg-primary text-primary-foreground hover:bg-primary/90">
              <Check className="h-3.5 w-3.5 mr-1.5" /> Salvar Alterações
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Identity Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome do Projeto</label>
              <Input
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="font-semibold"
                placeholder="Ex: Implantação de Novo Sistema"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Diretoria</label>
              <Input
                value={formData.directorate}
                onChange={(e) => setFormData({ ...formData, directorate: e.target.value })}
                placeholder="Ex: Diretoria de tecnologia"
              />
            </div>
          </div>

          <div className="w-full h-px bg-border/50" />

          {/* Process Context */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold text-foreground">Contexto & Processos</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Macroprocesso</label>
                <Input
                  value={formData.macroprocess}
                  onChange={(e) => setFormData({ ...formData, macroprocess: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Processo</label>
                <Input
                  value={formData.process}
                  onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Subprocesso</label>
                <Input
                  value={formData.subprocess}
                  onChange={(e) => setFormData({ ...formData, subprocess: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Stakeholders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dono do Processo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={formData.processOwner}
                  onChange={(e) => setFormData({ ...formData, processOwner: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Product Owner (PO)</label>
              <Input
                value={formData.productOwner}
                onChange={(e) => setFormData({ ...formData, productOwner: e.target.value })}
              />
            </div>
          </div>

          {/* Objective */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Objetivo Estratégico</label>
            <Textarea
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              className="resize-none min-h-[80px]"
              placeholder="Descreva o objetivo principal deste projeto..."
            />
          </div>
        </div>
      </div>
    ) : (
      <header className="bg-card rounded-lg border border-border shadow-sm p-6 md:p-8 animate-fade-in relative group transition-all hover:shadow-md">
        {/* Top Actions */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            {directorate ? (
              <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">
                {directorate}
              </span>
            ) : (
              <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wider mb-2 block">
                Sem Diretoria Definida
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight max-w-4xl">
              {projectName}
            </h1>
          </div>

          <div className="flex items-start gap-4">
            <Badge variant="outline" className="hidden sm:flex gap-1.5 py-1.5 px-3 border-green-200 bg-green-50 text-green-700 hover:bg-green-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Em Dia
            </Badge>
            {!readOnly && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFormData({ projectName, objective, directorate, macroprocess, process, subprocess, processOwner, productOwner });
                  setIsEditing(true);
                }}
                className="text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-4 w-4 mr-2" /> Editar
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-border">
          {/* Left Column: Context */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" /> Objetivo
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {objective || "Nenhum objetivo definido para este projeto."}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Dono do Processo</p>
                <p className="font-medium text-foreground text-sm">{processOwner || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Product Owner</p>
                <p className="font-medium text-foreground text-sm">{productOwner || "-"}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hierarquia */}
          <div className="bg-muted/30 rounded-lg p-5 border border-border/50">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <GitBranch className="h-3.5 w-3.5" /> Hierarquia de Processos
            </h4>
            <ul className="space-y-4 relative">
              {/* Vertical Line */}
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />

              <li className="relative pl-5">
                <div className="absolute left-[1px] top-1.5 h-2 w-2 rounded-full border border-primary bg-background" />
                <span className="text-xs text-muted-foreground block">Macroprocesso</span>
                <span className="text-sm font-medium text-foreground block">{macroprocess || "-"}</span>
              </li>
              <li className="relative pl-5">
                <div className="absolute left-[1px] top-1.5 h-2 w-2 rounded-full border border-primary bg-background" />
                <span className="text-xs text-muted-foreground block">Processo</span>
                <span className="text-sm font-medium text-foreground block">{process || "-"}</span>
              </li>
              <li className="relative pl-5">
                <div className="absolute left-[1px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground block">Subprocesso</span>
                <span className="text-sm font-medium text-foreground block">{subprocess || "-"}</span>
              </li>
            </ul>
          </div>
        </div>
      </header>
    )
  );
};

export default DashboardHeader;
