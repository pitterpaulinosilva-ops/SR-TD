import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Plus, Trash2, Search, Clock, ArrowUpRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { reportService } from "@/services/reportService";
import { Report } from "@/types/timeline";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";

import { MultiSelectFilter } from "@/components/ui/multi-select-filter";

const Home = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [selectedDirectorates, setSelectedDirectorates] = useState<Set<string>>(new Set());
    const [selectedProductOwners, setSelectedProductOwners] = useState<Set<string>>(new Set());
    const [selectedMacroprocesses, setSelectedMacroprocesses] = useState<Set<string>>(new Set());
    const [selectedProcesses, setSelectedProcesses] = useState<Set<string>>(new Set());
    const [selectedSubprocesses, setSelectedSubprocesses] = useState<Set<string>>(new Set());

    useEffect(() => {
        const data = reportService.getAll();
        setReports(data);
    }, []);

    const handleCreate = () => {
        const title = `Status Report ${new Date().toLocaleDateString("pt-BR")}`;
        const newReport = reportService.create(title);
        setReports([...reports, newReport]);
        toast.success("Novo Status Report criado!");
        navigate(`/report/${newReport.id}`);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm("Tem certeza que deseja excluir este report?")) {
            reportService.delete(id);
            setReports(reports.filter(r => r.id !== id));
            toast.success("Report excluído.");
        }
    };

    // Derived State for Stats
    const totalProjects = reports.length;
    const totalRisks = reports.reduce((acc, r) => acc + (r.risks?.length || 0), 0);

    // Calculate overall progress per report
    const getProgress = (report: Report) => {
        const allActivities = report.phases.flatMap(p => p.activities);
        if (allActivities.length === 0) return 0;
        const completed = allActivities.filter(a => a.status === "Entregue").length;
        return Math.round((completed / allActivities.length) * 100);
    };

    const getUniqueOptions = (items: Report[], key: keyof Report) => {
        return Array.from(new Set(items.map(item => item[key]).filter(Boolean))).map(value => ({
            label: value as string,
            value: value as string
        }));
    };

    const directorateOptions = getUniqueOptions(reports, "directorate");
    const productOwnerOptions = getUniqueOptions(reports, "productOwner");
    const macroprocessOptions = getUniqueOptions(reports, "macroprocess");
    const processOptions = getUniqueOptions(reports, "process");
    const subprocessOptions = getUniqueOptions(reports, "subprocess");

    const filteredReports = reports.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.projectName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDirectorate = selectedDirectorates.size === 0 || (r.directorate && selectedDirectorates.has(r.directorate));
        const matchesProductOwner = selectedProductOwners.size === 0 || (r.productOwner && selectedProductOwners.has(r.productOwner));
        const matchesMacroprocess = selectedMacroprocesses.size === 0 || (r.macroprocess && selectedMacroprocesses.has(r.macroprocess));
        const matchesProcess = selectedProcesses.size === 0 || (r.process && selectedProcesses.has(r.process));
        const matchesSubprocess = selectedSubprocesses.size === 0 || (r.subprocess && selectedSubprocesses.has(r.subprocess));

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
                            <Button onClick={handleCreate} size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg border-0 font-semibold gap-2 transition-transform hover:scale-105 active:scale-95">
                                <Plus className="h-5 w-5" /> Novo Projeto
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
                                placeholder="Buscar projetos..."
                                className="pl-10 bg-white border-muted-foreground/20 focus:border-primary/50 transition-all rounded-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground w-full sm:w-auto justify-end">
                            <span className="bg-primary/5 px-3 py-1 rounded-full text-primary font-medium">{filteredReports.length}</span> projetos encontrados
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
                        <MultiSelectFilter
                            title="Macroprocesso"
                            options={macroprocessOptions}
                            selectedValues={selectedMacroprocesses}
                            onSelect={setSelectedMacroprocesses}
                        />
                        <MultiSelectFilter
                            title="Processo"
                            options={processOptions}
                            selectedValues={selectedProcesses}
                            onSelect={setSelectedProcesses}
                        />
                        <MultiSelectFilter
                            title="Subprocesso"
                            options={subprocessOptions}
                            selectedValues={selectedSubprocesses}
                            onSelect={setSelectedSubprocesses}
                        />
                        {/* Clear All Filters Button */}
                        {(selectedDirectorates.size > 0 || selectedProductOwners.size > 0 || selectedMacroprocesses.size > 0 || selectedProcesses.size > 0 || selectedSubprocesses.size > 0) && (
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
                {filteredReports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/20">
                        <div className="bg-white p-4 rounded-full mb-4 shadow-sm ring-1 ring-border/50">
                            <FileText className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Nenhum projeto encontrado</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm text-center">Tente buscar com outro termo ou crie um novo projeto.</p>
                        <Button onClick={handleCreate} variant="outline" className="gap-2 rounded-full">
                            <Plus className="h-4 w-4" /> Criar Projeto
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredReports.map((report, index) => {
                            const progress = getProgress(report);
                            const hasRisks = report.risks && report.risks.length > 0;

                            return (
                                <Link
                                    key={report.id}
                                    to={`/report/${report.id}`}
                                    className="block group h-full outline-none"
                                >
                                    <Card className="h-full flex flex-col border-border/60 hover:border-primary/30 shadow-card hover:shadow-elevated transition-all duration-300 relative overflow-hidden bg-white/60 hover:bg-white transform hover:-translate-y-1">
                                        {/* Status Line Top */}
                                        <div className={`absolute top-0 left-0 w-full h-1 ${progress === 100 ? 'bg-success' : 'bg-primary'} opacity-80`} />

                                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-6">
                                            <div className="space-y-1.5 flex-1 pr-4">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/50 inline-block">
                                                    {report.directorate || "Diretoria"}
                                                </span>
                                                <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                    {report.title}
                                                </CardTitle>
                                            </div>
                                            <div className="p-2 bg-slate-50 rounded-full group-hover:bg-primary/5 transition-colors border border-slate-100">
                                                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex-1 space-y-4">
                                            {report.objective && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {report.objective}
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
                                                    <p className="text-sm font-bold text-slate-700">{report.phases.length}</p>
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

                                        <CardFooter className="flex justify-between items-center py-4 border-t border-border/40 bg-slate-50/50 group-hover:bg-white transition-colors">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{new Date(report.createdAt || Date.now()).toLocaleDateString('pt-BR')}</span>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                                onClick={(e) => handleDelete(report.id, e)}
                                                title="Excluir projeto"
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
        </Layout >
    );
};

export default Home;
