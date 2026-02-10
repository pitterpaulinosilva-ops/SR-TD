import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Plus, Trash2, Search, Clock, ArrowUpRight, Calendar, Layers } from "lucide-react";
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

    // Derived State for Stats
    const totalItems = items.length;

    // Calculate overall progress per item
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

        return matchesSearch && matchesDirectorate && matchesProductOwner && matchesMacroprocess && matchesProcess && matchesSubprocess;
    });

    return (
        <Layout>
            <div className="space-y-8 pb-10">
                {/* Hero / Header Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-blue-900 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl opacity-50 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl opacity-50 pointer-events-none"></div>

                    <div className="relative z-10 p-8 sm:p-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-2">
                                <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/20 mb-2">
                                    <Clock className="mr-1.5 h-3 w-3" /> {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-display">
                                    Painel de Projetos
                                </h1>
                                <p className="text-blue-100 max-w-xl text-lg opacity-90">
                                    Acompanhe o progresso, riscos e entregas de todas as iniciativas estratégicas SESI/SENAI.
                                </p>
                            </div>
                            <Button onClick={() => setIsSelectorOpen(true)} size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg border-0 font-semibold gap-2 transition-transform hover:scale-105 active:scale-95">
                                <Plus className="h-5 w-5" /> Novo Item
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-col gap-4 bg-white/50 p-4 rounded-xl border border-white/50 backdrop-blur-sm shadow-sm sticky top-20 z-40 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                        <div className="relative w-full sm:w-96 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Buscar projetos e programas..."
                                className="pl-10 bg-white border-muted-foreground/20 focus:border-primary/50 transition-all rounded-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground w-full sm:w-auto justify-end">
                            <span className="bg-primary/5 px-3 py-1 rounded-full text-primary font-medium">{filteredItems.length}</span> itens encontrados
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
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
                        {/* More filters can be added here */}

                        {(selectedDirectorates.size > 0 || selectedProductOwners.size > 0) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedDirectorates(new Set());
                                    setSelectedProductOwners(new Set());
                                    setSelectedMacroprocesses(new Set());
                                    setSelectedProcesses(new Set());
                                    setSelectedSubprocesses(new Set());
                                }}
                                className="text-muted-foreground hover:text-primary"
                            >
                                Limpar filtros
                            </Button>
                        )}
                    </div>
                </div>

                {/* Projects Grid */}
                {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/20">
                        <div className="bg-white p-4 rounded-full mb-4 shadow-sm ring-1 ring-border/50">
                            <FileText className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Nenhum item encontrado</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm text-center">Tente buscar com outro termo ou crie um novo item.</p>
                        <Button onClick={() => setIsSelectorOpen(true)} variant="outline" className="gap-2 rounded-full">
                            <Plus className="h-4 w-4" /> Criar Novo
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
                                    <Card
                                        className={cn(
                                            "h-full flex flex-col shadow-card hover:shadow-elevated transition-all duration-300 relative overflow-hidden transform hover:-translate-y-1",
                                            isProgram
                                                ? "bg-blue-50/40 border-blue-200/60 hover:border-blue-300 hover:bg-blue-50/80"
                                                : "bg-white/60 border-border/60 hover:border-primary/30 hover:bg-white"
                                        )}
                                    >
                                        {/* Status Line Top */}
                                        <div className={cn(
                                            "absolute top-0 left-0 w-full h-1 opacity-80",
                                            progress === 100 ? 'bg-success' : 'bg-primary'
                                        )} />

                                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-6">
                                            <div className="space-y-1.5 flex-1 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/50 inline-block">
                                                        {item.directorate || "Diretoria"}
                                                    </span>
                                                    {isProgram && (
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200 inline-flex items-center gap-1">
                                                            <Layers className="h-3 w-3" /> Programa
                                                        </span>
                                                    )}
                                                </div>
                                                <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                    {item.title}
                                                </CardTitle>
                                            </div>
                                            <div className={cn(
                                                "p-2 rounded-full transition-colors border",
                                                isProgram
                                                    ? "bg-blue-100 border-blue-200 group-hover:bg-blue-200"
                                                    : "bg-slate-50 border-slate-100 group-hover:bg-primary/5"
                                            )}>
                                                {isProgram ? (
                                                    <Layers className="h-4 w-4 text-blue-600" />
                                                ) : (
                                                    <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                                                )}
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex-1 space-y-4">
                                            {item.objective && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {item.objective}
                                                </p>
                                            )}

                                            <div className="space-y-2 pt-2">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className="text-muted-foreground">Progresso</span>
                                                    <span className={progress === 100 ? "text-success" : "text-primary"}>{progress}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-success' : 'bg-primary'}`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 pt-2">
                                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 group-hover:border-primary/10 transition-colors">
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Fases</p>
                                                    <p className="text-sm font-bold text-slate-700">{(item.phases || []).length}</p>
                                                </div>
                                                <div className={`p-2 rounded-lg border transition-colors ${progress === 100
                                                    ? 'bg-green-50 border-green-100'
                                                    : 'bg-blue-50 border-blue-100'
                                                    }`}>
                                                    <p className={`text-[10px] uppercase tracking-wider font-semibold ${progress === 100 ? 'text-green-600/80' : 'text-blue-600/80'
                                                        }`}>Status</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`relative flex h-2 w-2`}>
                                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${progress === 100 ? 'bg-green-400' : 'bg-blue-400'
                                                                }`}></span>
                                                            <span className={`relative inline-flex rounded-full h-2 w-2 ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                                                                }`}></span>
                                                        </span>
                                                        <p className={`text-sm font-bold ${progress === 100 ? 'text-green-700' : 'text-blue-700'
                                                            }`}>
                                                            {progress === 100 ? 'Concluído' : 'No Prazo'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="flex justify-between items-center py-4 border-t border-border/40 bg-transparent group-hover:bg-white/50 transition-colors">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{new Date(item.createdAt || Date.now()).toLocaleDateString('pt-BR')}</span>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                                onClick={(e) => handleDelete(item.id, item.type, e)}
                                                title={`Excluir ${isProgram ? 'programa' : 'projeto'}`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </CardFooter>
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
