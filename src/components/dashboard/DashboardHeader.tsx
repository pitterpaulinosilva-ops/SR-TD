import { useState } from "react";
import { Check, Edit2, LayoutDashboard, X, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  projectName = "Novo Sistema de Saúde",
  objective = "Implementação da nova plataforma...",
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

  // Monta a cadeia de processos para exibição
  const processChain = [macroprocess, process, subprocess].filter(Boolean).join(" → ");

  return (
    isEditing ? (
      <header className="flex flex-col gap-4 p-6 bg-card rounded-xl border border-border shadow-card animate-fade-in w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400" />
        <div className="flex items-start justify-between gap-4 pt-2">
          <div className="flex-1 space-y-4">
            {/* Primeira linha: Nome do Projeto e Diretoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome do Projeto</label>
                <Input
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="text-lg font-bold bg-muted/30 border-muted-foreground/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Diretoria</label>
                <Input
                  value={formData.directorate}
                  onChange={(e) => setFormData({ ...formData, directorate: e.target.value })}
                  placeholder="Ex: Diretoria de Saúde e Segurança"
                  className="text-base bg-muted/30 border-muted-foreground/20"
                />
              </div>
            </div>

            {/* Segunda linha: Cadeia de Processos (Azure DevOps) */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <GitBranch className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Cadeia de Processos (Azure DevOps)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Macroprocesso</label>
                  <Input
                    value={formData.macroprocess}
                    onChange={(e) => setFormData({ ...formData, macroprocess: e.target.value })}
                    placeholder="Ex: Gestão de Saúde"
                    className="text-sm bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Processo</label>
                  <Input
                    value={formData.process}
                    onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                    placeholder="Ex: Saúde Ocupacional"
                    className="text-sm bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Subprocesso</label>
                  <Input
                    value={formData.subprocess}
                    onChange={(e) => setFormData({ ...formData, subprocess: e.target.value })}
                    placeholder="Ex: Sistema Integrado"
                    className="text-sm bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Terceira linha: Dono do Processo e PO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dono do Processo</label>
                <Input
                  value={formData.processOwner}
                  onChange={(e) => setFormData({ ...formData, processOwner: e.target.value })}
                  placeholder="Nome do Dono do Processo"
                  className="text-sm bg-muted/30 border-muted-foreground/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Product Owner (PO)</label>
                <Input
                  value={formData.productOwner}
                  onChange={(e) => setFormData({ ...formData, productOwner: e.target.value })}
                  placeholder="Nome do PO"
                  className="text-sm bg-muted/30 border-muted-foreground/20"
                />
              </div>
            </div>

            {/* Quarta linha: Objetivo */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Objetivo</label>
              <Textarea
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                className="resize-none bg-muted/30 border-muted-foreground/20"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleCancel} className="hover:bg-destructive/10 hover:text-destructive">
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-primary text-white shadow-lg shadow-primary/20">
              <Check className="h-4 w-4" /> Salvar
            </Button>
          </div>
        </div>
      </header>
    ) : (
      <header className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl shadow-slate-200/50 animate-fade-in relative group overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-primary/50" />

        <div className="flex items-start gap-5 pt-2 relative z-10 w-full">
          <div className="p-3.5 bg-gradient-to-br from-primary to-blue-700 rounded-xl shadow-lg shadow-primary/20 text-white hidden sm:block">
            <LayoutDashboard className="h-6 w-6" />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-blue-700/10">
                  {directorate || "DIRETORIA NÃO DEFINIDA"}
                </span>
                {processChain && (
                  <>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <GitBranch className="h-3 w-3" />
                      <span className="truncate max-w-[300px]" title={processChain}>{processChain}</span>
                    </div>
                  </>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight leading-tight">
                {projectName}
              </h1>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {processOwner && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-primary/80">Dono do Processo:</span>
                  <span className="text-slate-700">{processOwner}</span>
                </div>
              )}
              {productOwner && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-primary/80">PO:</span>
                  <span className="text-slate-700">{productOwner}</span>
                </div>
              )}
            </div>

            <p className="text-slate-600 text-sm leading-relaxed max-w-3xl border-l-2 border-primary/20 pl-4 py-1">
              {objective || "Sem objetivo definido."}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 pl-4 border-l border-slate-100 min-w-[120px]">
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Em Dia</span>
            </div>

            {!readOnly && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary gap-1.5 h-8 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0"
                onClick={() => {
                  setFormData({
                    projectName,
                    objective,
                    directorate: directorate || "",
                    macroprocess: macroprocess || "",
                    process: process || "",
                    subprocess: subprocess || "",
                    processOwner: processOwner || "",
                    productOwner: productOwner || ""
                  });
                  setIsEditing(true);
                }}
              >
                <Edit2 className="h-3.5 w-3.5" /> Editar
              </Button>
            )}
          </div>
        </div>
      </header>
    )
  );
};

export default DashboardHeader;
