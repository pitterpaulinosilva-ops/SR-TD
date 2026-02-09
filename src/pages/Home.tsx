import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Plus, Trash2, Edit, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { reportService } from "@/services/reportService";
import { Report } from "@/types/timeline";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";

const Home = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load reports or initialize
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

    return (
        <Layout>
            <div className="space-y-8">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">Meus Status Reports</h1>
                        <p className="text-muted-foreground mt-1 text-lg">Gerencie os relatórios dos projetos SESI SENAI</p>
                    </div>
                    <Button onClick={handleCreate} className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                        <Plus className="h-4 w-4" /> Novo Report
                    </Button>
                </header>

                {reports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-xl border border-dashed border-muted-foreground/25">
                        <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Nenhum relatório encontrado</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm text-center">Comece criando seu primeiro status report para acompanhar o progresso dos projetos.</p>
                        <Button onClick={handleCreate} variant="outline" className="gap-2">
                            <Plus className="h-4 w-4" /> Criar o primeiro
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map((report) => (
                            <Link key={report.id} to={`/report/${report.id}`} className="block h-full">
                                <Card className="group h-full flex flex-col hover:shadow-elevated transition-all duration-300 border-muted hover:border-primary/20 relative overflow-hidden bg-white/50 hover:bg-white">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-primary uppercase tracking-wider">Projeto</p>
                                            <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                                                {report.title}
                                            </CardTitle>
                                        </div>
                                        <div className="p-2 bg-muted rounded-full group-hover:bg-primary/10 transition-colors">
                                            <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex-1 pt-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Criado em</span>
                                                <span className="font-medium">{new Date(report.createdAt || Date.now()).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Fases</span>
                                                <span className="px-2 py-0.5 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">
                                                    {report.phases.length} fases
                                                </span>
                                            </div>
                                            {report.objective && (
                                                <p className="text-xs text-muted-foreground line-clamp-2 mt-2 pt-2 border-t border-dashed">
                                                    {report.objective}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex justify-between pt-4 border-t bg-muted/30 group-hover:bg-background transition-colors">
                                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground group-hover:text-primary pl-0 hover:bg-transparent">
                                            Ver detalhes <ChevronRight className="h-4 w-4" />
                                        </Button>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                onClick={(e) => handleDelete(report.id, e)}
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Home;
