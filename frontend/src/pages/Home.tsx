import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Plus, Trash2, Search, ArrowUpRight, Calendar, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { reportService } from "@/services/reportService";
import { programService } from "@/services/programService";
import { Report } from "@/types/timeline";
import { Program } from "@/types/program";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import KpiCards from "@/components/dashboard/KpiCards";

import { ProjectTypeSelector } from "@/components/dashboard/ProjectTypeSelector";
import { MultiSelectFilter } from "@/components/ui/multi-select-filter";

type DashboardItem = (Report & { type: "project" }) | (Program & { type: "program" });

const Home = () => {
    const [items, setItems] = useState<DashboardItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // Filters
    const [selectedDirectorates, setSelectedDirectorates] = useState<Set<string>>(new Set());
    const [selectedProductOwners, setSelectedProductOwners] = useState<Set<string>>(new Set());
    const [selectedMacroprocesses, setSelectedMacroprocesses] = useState<Set<string>>(new Set());
    const [selectedProcesses, setSelectedProcesses] = useState<Set<string>>(new Set());
    const [selectedSubprocesses, setSelectedSubprocesses] = useState<Set<string>>(new Set());
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    useEffect(() => {
        const loadData = () => {
            const reports = reportService.getAll().map(r => ({ ...r, phases: r.phases || [], type: "project" as const }));
            const programs = programService.getAll().map(p => ({ ...p, phases: p.phases || [], type: "program" as const }));
            // Sort by creation date descending
            const combined = [...programs, ...reports].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setItems(combined);
        };
        loadData();
    }, []);

    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    const handleCreateProject = () => {
        const title = `Status Report ${new Date().toLocaleDateString("pt-BR")}`;
        const newReport = reportService.create(title);
        // Refresh list
        loadItems();

        toast.success("Novo Status Report criado!");
        navigate(`/report/${newReport.id}`);
    };

    const handleSelectType = (type: "project" | "program") => {
        setIsSelectorOpen(false);
        if (type === "project") {
            handleCreateProject();
        } else {
            const title = `Programa Estratégico ${new Date().toLocaleDateString("pt-BR")}`;
            const newProgram = programService.create(title);
            // Refresh list
            loadItems();

            toast.success("Novo Programa Estratégico criado!");
            navigate(`/program/${newProgram.id}`);
        }
    };

    const loadItems = () => {
        const reports = reportService.getAll().map(r => ({ ...r, phases: r.phases || [], type: "project" as const }));
        const programs = programService.getAll().map(p => ({ ...p, phases: p.phases || [], type: "program" as const }));
        setItems([...programs, ...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    };

    const handleDelete = (id: string, type: "project" | "program", e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm(`Tem certeza que deseja excluir este ${type === 'project' ? 'projeto' : 'programa'}?`)) {
            if (type === "project") {
                reportService.delete(id);
            } else {
                programService.delete(id);
            }
            // Optimistic update
            setItems(prev => prev.filter(item => item.id !== id));
            toast.success("Item excluído.");
        }
    };

    // Helper functions
    const getProgress = (item: DashboardItem) => {
        const phases = item.phases || [];
        const allActivities = phases.flatMap(p => p.activities || []);
        if (allActivities.length === 0) return 0;
        const completed = allActivities.filter(a => a.status === "Entregue").length;
        return Math.round((completed / allActivities.length) * 100);
    };

    const getUniqueOptions = (items: DashboardItem[], key: keyof Report) => {
        return Array.from(new Set(items.map(item => item[key] as string).filter(Boolean))).map(value => ({
            label: value,
            value: value
        }));
    };

    const directorateOptions = getUniqueOptions(items, "directorate");
    const productOwnerOptions = getUniqueOptions(items, "productOwner");
    const macroprocessOptions = getUniqueOptions(items, "macroprocess");
    const processOptions = getUniqueOptions(items, "process");
    const subprocessOptions = getUniqueOptions(items, "subprocess");


    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.projectName?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const matchesDirectorate = selectedDirectorates.size === 0 || (item.directorate && selectedDirectorates.has(item.directorate));
        const matchesProductOwner = selectedProductOwners.size === 0 || (item.productOwner && selectedProductOwners.has(item.productOwner));
        const matchesMacroprocess = selectedMacroprocesses.size === 0 || (item.macroprocess && selectedMacroprocesses.has(item.macroprocess));
        const matchesProcess = selectedProcesses.size === 0 || (item.process && selectedProcesses.has(item.process));
        const matchesSubprocess = selectedSubprocesses.size === 0 || (item.subprocess && selectedSubprocesses.has(item.subprocess));

        const itemDate = new Date(item.createdAt || Date.now());
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;

        // Adjust end date to include the whole day
        if (endDate) endDate.setHours(23, 59, 59, 999);

        const matchesDate = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);

        return matchesSearch && matchesDirectorate && matchesProductOwner && matchesMacroprocess && matchesProcess && matchesSubprocess && matchesDate;
    });

    const hasActiveFilters = selectedDirectorates.size > 0 || selectedProductOwners.size > 0 ||
        selectedMacroprocesses.size > 0 || selectedProcesses.size > 0 ||
        selectedSubprocesses.size > 0 || dateRange.start || dateRange.end;

    // Calculate portfolio average progress
    const averageProgress = items.length > 0
        ? Math.round(items.reduce((acc, item) => acc + getProgress(item), 0) / items.length)
        : 0;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">

                {/* ─── Executive Header ─── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                                Portfólio Estratégico
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            Visão Geral
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-xl">
                            Acompanhamento integrado de programas e projetos estratégicos SESI/SENAI.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right mr-4 border-r border-border pr-6">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Última Atualização</p>
                            <p className="text-sm font-semibold text-foreground">
                                {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <Button
                            onClick={() => setIsSelectorOpen(true)}
                            className="bg-primary hover:bg-primary/90 text-white shadow-sm h-10 px-6 font-medium transition-all"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Novo Registro
                        </Button>
                    </div>
                </div>

                {/* ─── Control Bar ─── */}
                <div className="bg-card rounded-lg border border-border shadow-sm p-4 sticky top-4 z-30 transition-shadow hover:shadow-md">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">

                            {/* Search */}
                            <div className="relative w-full sm:w-80 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Buscar por título, ID ou responsável..."
                                    className="pl-10 bg-background border-input focus:border-primary transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Active Filters Summary */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">{filteredItems.length}</span> resultados
                            </div>
                        </div>

                        {/* Filters Row */}
                        <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-border">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-2">Filtros:</div>
                            <MultiSelectFilter
                                title="Diretoria"
                                options={directorateOptions}
                                selectedValues={selectedDirectorates}
                                onSelect={setSelectedDirectorates}
                            />
                            <MultiSelectFilter
                                title="Product Owner"
                                options={productOwnerOptions}
                                selectedValues={selectedProductOwners}
                                onSelect={setSelectedProductOwners}
                            />
                            <div className="w-px h-6 bg-border mx-1" />
                            <MultiSelectFilter
                                title="Macroprocesso"
                                options={macroprocessOptions}
                                selectedValues={selectedMacroprocesses}
                                onSelect={setSelectedMacroprocesses}
                            />
                            {/* Date Range - Compact */}
                            <div className="flex items-center gap-1.5 bg-background border border-input rounded-md px-2 h-8">
                                <span className="text-[10px] font-medium text-muted-foreground uppercase">Periodo</span>
                                <input
                                    type="date"
                                    className="bg-transparent border-none focus:outline-none text-xs w-24 text-foreground"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                />
                                <span className="text-muted-foreground text-[10px]">-</span>
                                <input
                                    type="date"
                                    className="bg-transparent border-none focus:outline-none text-xs w-24 text-foreground"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                />
                            </div>

                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedDirectorates(new Set());
                                        setSelectedProductOwners(new Set());
                                        setSelectedMacroprocesses(new Set());
                                        setSelectedProcesses(new Set());
                                        setSelectedSubprocesses(new Set());
                                        setDateRange({ start: "", end: "" });
                                    }}
                                    className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-3 text-xs font-medium"
                                >
                                    Limpar tudo
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ─── KPI Summary ─── */}
                <KpiCards totalProgress={averageProgress} />

                {/* ─── Projects Grid ─── */}
                {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-muted/30 rounded-lg border border-dashed border-border">
                        <div className="rounded-full bg-background p-4 mb-4 shadow-sm ring-1 ring-border">
                            <FileText className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Nenhum registro encontrado</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                            Não encontramos projetos ou programas com os filtros atuais.
                        </p>
                        <Button onClick={() => setIsSelectorOpen(true)} className="bg-primary text-white shadow-sm">
                            <Plus className="h-4 w-4 mr-2" /> Criar Novo Item
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => {
                            const progress = getProgress(item);
                            const isProgram = item.type === "program";

                            return (
                                <Link
                                    key={item.id}
                                    to={`/${isProgram ? 'program' : 'report'}/${item.id}`}
                                    className="block group h-full outline-none"
                                >
                                    <Card className="h-full flex flex-col bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 overflow-hidden relative">
                                        {/* Status Accent Line */}
                                        <div className={cn(
                                            "absolute top-0 left-0 w-1 h-full",
                                            isProgram ? "bg-accent" : "bg-primary"
                                        )} />

                                        <CardHeader className="pl-5 pb-3 pt-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    {isProgram ? (
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full uppercase tracking-wide">
                                                            <Layers className="h-3 w-3" /> Programa
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wide">
                                                            <FileText className="h-3 w-3" /> Projeto
                                                        </span>
                                                    )}
                                                    {item.directorate && (
                                                        <span className="text-[10px] font-medium text-muted-foreground border border-border px-2 py-0.5 rounded uppercase tracking-wider">
                                                            {item.directorate}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </div>
                                            <CardTitle className="text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="pl-5 pt-0 flex-1 flex flex-col gap-4">
                                            {item.objective && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] leading-relaxed">
                                                    {item.objective}
                                                </p>
                                            )}

                                            <div className="mt-auto pt-4 border-t border-border border-dashed">
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Progresso</span>
                                                    <span className="text-lg font-bold text-foreground tabular-nums">{progress}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-1000 ease-out",
                                                            progress === 100 ? "bg-success" : isProgram ? "bg-accent" : "bg-primary"
                                                        )}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={cn(
                                                        "h-2 w-2 rounded-full",
                                                        progress === 100 ? "bg-success" : "bg-blue-500 animate-pulse"
                                                    )} />
                                                    <span className="text-xs font-medium text-foreground">
                                                        {progress === 100 ? "Concluído" : "Em Andamento"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {new Date(item.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            <ProjectTypeSelector
                open={isSelectorOpen}
                onOpenChange={setIsSelectorOpen}
                onSelect={(type) => handleSelectType(type as "project" | "program")}
            />
        </Layout >
    );
};

export default Home;
