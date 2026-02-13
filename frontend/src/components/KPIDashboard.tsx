import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useKPIData } from "@/hooks/useKPIData";
import { Loader2, TrendingUp, TrendingDown, Minus, Calendar, Filter, BarChart3, Activity, PieChart as PieIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { calcularKPIs } from "@/lib/kpi_engine";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

type FilterMode = 'overview' | 'sprint' | 'month';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface KPIDashboardProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    workItemTypes?: string[];
    defaultSprint?: number;
}

export function KPIDashboard({
    title = "Painel de Indicadores Táticos",
    description = "Gestão por Valor - Azure DevOps",
    icon = <Activity className="h-5 w-5 text-primary" />,
    workItemTypes,
    defaultSprint = 36
}: KPIDashboardProps) {
    const [filterMode, setFilterMode] = useState<FilterMode>('overview');
    const [selectedSprint, setSelectedSprint] = useState<number | undefined>(defaultSprint);
    const [selectedMonth, setSelectedMonth] = useState<string>('');

    // Load data based on filter mode and types
    const sprintFilter = filterMode === 'sprint' ? selectedSprint : undefined;
    const { kpis, loading, error, availableSprints, rawData, processedData } = useKPIData({
        sprintNum: sprintFilter,
        workItemTypes: workItemTypes
    });

    // Get available months from data
    const availableMonths = useMemo(() => {
        if (!processedData) return [];

        const months = new Set<string>();
        processedData.forEach(item => {
            if (item.parsed_closedDate) {
                const month = item.parsed_closedDate.toISOString().substring(0, 7);
                months.add(month);
            }
        });

        return Array.from(months).sort().reverse();
    }, [processedData]);

    // Set default month once data is loaded
    useEffect(() => {
        if (!selectedMonth && availableMonths.length > 0) {
            setSelectedMonth(availableMonths[0]);
        }
    }, [availableMonths, selectedMonth]);

    // Filter by month if needed
    const filteredByMonth = useMemo(() => {
        if (filterMode !== 'month' || !processedData || !selectedMonth) return processedData;

        return processedData.filter(item => {
            if (!item.parsed_closedDate) return false;
            const itemMonth = item.parsed_closedDate.toISOString().substring(0, 7);
            return itemMonth === selectedMonth;
        });
    }, [filterMode, selectedMonth, processedData]);

    // Calculate KPIs for month view
    const monthKpis = useMemo(() => {
        if (filterMode !== 'month' || !filteredByMonth) return null;
        return calcularKPIs(filteredByMonth);
    }, [filterMode, filteredByMonth]);

    // Overview statistics and chart data
    const overviewData = useMemo(() => {
        if (!rawData) return null;

        const totalItems = rawData.length;
        const closedItems = rawData.filter(i => i.state === 'Closed' || i.state === 'Concluído').length;
        const epics = rawData.filter(i => i.type === 'Epic').length;
        const uniqueSprints = availableSprints.length;

        // Data for Pie Chart (Status Distribution)
        const statusMap: Record<string, number> = {};
        rawData.forEach(item => {
            statusMap[item.state] = (statusMap[item.state] || 0) + 1;
        });

        const chartData = Object.entries(statusMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6); // Top 6 status

        return { totalItems, closedItems, epics, uniqueSprints, chartData };
    }, [rawData, availableSprints]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card/50 rounded-lg border border-dashed">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <span className="text-sm text-muted-foreground font-medium">Processando {title}...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                <p className="text-destructive font-semibold">Erro ao carregar dados:</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
        );
    }

    const displayKpis = filterMode === 'month' ? monthKpis : kpis;

    if (!displayKpis) {
        return <div className="text-center text-muted-foreground py-12 border rounded-lg bg-muted/5">Nenhum dado de "{title}" disponível</div>;
    }

    const getColorClass = (cor?: string) => {
        switch (cor) {
            case 'green': return 'text-success';
            case 'yellow': return 'text-amber-500';
            case 'red': return 'text-destructive';
            default: return 'text-muted-foreground';
        }
    };

    const getBgColorClass = (cor?: string) => {
        switch (cor) {
            case 'green': return 'bg-success/5 border-success/20';
            case 'yellow': return 'bg-amber-500/5 border-amber-500/20';
            case 'red': return 'bg-destructive/5 border-destructive/20';
            default: return 'bg-muted/5 border-muted/20';
        }
    };

    const getIcon = (cor?: string) => {
        switch (cor) {
            case 'green': return <TrendingUp className="h-4 w-4" />;
            case 'red': return <TrendingDown className="h-4 w-4" />;
            default: return <Minus className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {icon}
                        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{workItemTypes ? workItemTypes.join(', ') : 'Todos os tipos'}</span>
                        <span className="text-xs text-muted-foreground">{description}</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Filter Mode Buttons */}
                    <div className="inline-flex rounded-lg border border-border bg-background p-1 shadow-sm">
                        <Button
                            variant={filterMode === 'overview' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setFilterMode('overview')}
                            className={cn("text-xs h-8 px-4", filterMode === 'overview' && "shadow-sm")}
                        >
                            <BarChart3 className="h-3.5 w-3.5 mr-2" />
                            Geral
                        </Button>
                        <Button
                            variant={filterMode === 'sprint' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setFilterMode('sprint')}
                            className={cn("text-xs h-8 px-4", filterMode === 'sprint' && "shadow-sm")}
                        >
                            <Filter className="h-3.5 w-3.5 mr-2" />
                            Sprint
                        </Button>
                        <Button
                            variant={filterMode === 'month' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setFilterMode('month')}
                            className={cn("text-xs h-8 px-4", filterMode === 'month' && "shadow-sm")}
                        >
                            <Calendar className="h-3.5 w-3.5 mr-2" />
                            Mês/Ano
                        </Button>
                    </div>

                    {filterMode === 'sprint' && (
                        <Select
                            value={selectedSprint?.toString()}
                            onValueChange={(val) => setSelectedSprint(parseInt(val))}
                        >
                            <SelectTrigger className="w-[120px] h-10">
                                <SelectValue placeholder="Sprint" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableSprints.length > 0 ? (
                                    availableSprints.map(sprint => (
                                        <SelectItem key={sprint} value={sprint.toString()}>
                                            Sprint {sprint}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="none" disabled>Nenhuma Sprint</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    )}

                    {filterMode === 'month' && (
                        <Select
                            value={selectedMonth}
                            onValueChange={setSelectedMonth}
                        >
                            <SelectTrigger className="w-[150px] h-10">
                                <SelectValue placeholder="Mês/Ano" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableMonths.map(month => {
                                    const [year, monthNum] = month.split('-');
                                    const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
                                    return (
                                        <SelectItem key={month} value={month}>
                                            {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Stats or Distribution */}
                <div className="lg:col-span-1 space-y-6">
                    {filterMode === 'overview' && overviewData ? (
                        <Card className="h-full">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <PieIcon className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-sm font-semibold uppercase tracking-wider">Status Distribution</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[240px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={overviewData.chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {overviewData.chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Total</p>
                                        <p className="text-2xl font-black">{overviewData.totalItems.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-success/5 p-3 rounded-lg border border-success/10">
                                        <p className="text-[10px] text-success/70 uppercase font-black tracking-widest mb-1">Concluídos</p>
                                        <p className="text-2xl font-black text-success">{overviewData.closedItems.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-full border-dashed flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/5">
                            <Activity className="h-16 w-16 opacity-10 mb-6" />
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Context Analysis</h3>
                            <p className="text-xs max-w-[220px] leading-relaxed">
                                {filterMode === 'sprint'
                                    ? `Metrics calculated specifically for Sprint ${selectedSprint}.`
                                    : `Monthly analysis based on work items closed in ${new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}.`
                                }
                            </p>
                            {filterMode !== 'overview' && (
                                <Badge variant="secondary" className="mt-6 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                                    {filterMode === 'month' ? `${filteredByMonth?.length || 0} ITEMS ANALYZED` : `${processedData?.length || 0} ITEMS ANALYZED`}
                                </Badge>
                            )}
                        </Card>
                    )}
                </div>

                {/* Right Column: KPIs Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tempo Médio de Análise */}
                    <Card className="hover:shadow-lg transition-all group overflow-hidden border-2 border-transparent hover:border-primary/20">
                        <div className="h-1.5 w-full bg-primary/20 group-hover:bg-primary transition-colors" />
                        <CardHeader className="pb-1">
                            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tempo Médio de Análise</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black tracking-tighter">{displayKpis.tempo_medio.valor.toFixed(1)}</span>
                                <span className="text-sm font-bold text-muted-foreground uppercase">{displayKpis.tempo_medio.unidade}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-4 line-clamp-2 leading-relaxed opacity-70">
                                {displayKpis.tempo_medio.help}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Taxa de Implantação */}
                    <Card className={cn("hover:shadow-lg transition-all group overflow-hidden border-2 border-transparent", getBgColorClass(displayKpis.implantacao.cor),
                        displayKpis.implantacao.cor === 'green' && 'hover:border-success/30',
                        displayKpis.implantacao.cor === 'yellow' && 'hover:border-amber-500/30',
                        displayKpis.implantacao.cor === 'red' && 'hover:border-destructive/30'
                    )}>
                        <div className={cn("h-1.5 w-full opacity-30 group-hover:opacity-100 transition-opacity",
                            displayKpis.implantacao.cor === 'green' ? 'bg-success' :
                                displayKpis.implantacao.cor === 'yellow' ? 'bg-amber-500' : 'bg-destructive')}
                        />
                        <CardHeader className="pb-1">
                            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Taxa de Implantação</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black tracking-tighter">{displayKpis.implantacao.valor.toFixed(1)}%</span>
                                </div>
                                <div className={cn("p-3 rounded-xl bg-background shadow-sm border", getColorClass(displayKpis.implantacao.cor))}>
                                    {getIcon(displayKpis.implantacao.cor)}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 mt-4">
                                <span className={cn("text-xs font-black uppercase tracking-wider", getColorClass(displayKpis.implantacao.cor))}>{displayKpis.implantacao.classificacao}</span>
                                <span className="text-[10px] text-muted-foreground font-medium opacity-80 leading-relaxed">{displayKpis.implantacao.msg}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cronograma */}
                    <Card className={cn("hover:shadow-lg transition-all group overflow-hidden border-2 border-transparent", getBgColorClass(displayKpis.cronograma.cor),
                        displayKpis.cronograma.cor === 'green' && 'hover:border-success/30',
                        displayKpis.cronograma.cor === 'yellow' && 'hover:border-amber-500/30',
                        displayKpis.cronograma.cor === 'red' && 'hover:border-destructive/30'
                    )}>
                        <div className={cn("h-1.5 w-full opacity-30 group-hover:opacity-100 transition-opacity",
                            displayKpis.cronograma.cor === 'green' ? 'bg-success' :
                                displayKpis.cronograma.cor === 'yellow' ? 'bg-amber-500' : 'bg-destructive')}
                        />
                        <CardHeader className="pb-1">
                            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Cumprimento de Cronograma</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black tracking-tighter">{displayKpis.cronograma.valor.toFixed(0)}%</span>
                                </div>
                                <div className={cn("p-3 rounded-xl bg-background shadow-sm border", getColorClass(displayKpis.cronograma.cor))}>
                                    {getIcon(displayKpis.cronograma.cor)}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 mt-4">
                                <span className={cn("text-xs font-black uppercase tracking-wider", getColorClass(displayKpis.cronograma.cor))}>{displayKpis.cronograma.msg.split(' ')[0]}</span>
                                <span className="text-[10px] text-muted-foreground font-medium opacity-80 leading-relaxed">{displayKpis.cronograma.help}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Desvio de Escopo */}
                    <Card className={cn("hover:shadow-lg transition-all group overflow-hidden border-2 border-transparent", getBgColorClass(displayKpis.desvio.cor),
                        displayKpis.desvio.cor === 'green' && 'hover:border-success/30',
                        displayKpis.desvio.cor === 'yellow' && 'hover:border-amber-500/30',
                        displayKpis.desvio.cor === 'red' && 'hover:border-destructive/30'
                    )}>
                        <div className={cn("h-1.5 w-full opacity-30 group-hover:opacity-100 transition-opacity",
                            displayKpis.desvio.cor === 'green' ? 'bg-success' :
                                displayKpis.desvio.cor === 'yellow' ? 'bg-amber-500' : 'bg-destructive')}
                        />
                        <CardHeader className="pb-1">
                            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Desvio de Escopo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black tracking-tighter">{displayKpis.desvio.valor.toFixed(1)}%</span>
                                </div>
                                <div className={cn("p-3 rounded-xl bg-background shadow-sm border", getColorClass(displayKpis.desvio.cor))}>
                                    {getIcon(displayKpis.desvio.cor)}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 mt-4">
                                <span className={cn("text-xs font-black uppercase tracking-wider", getColorClass(displayKpis.desvio.cor))}>{displayKpis.desvio.msg.split(' ')[0]}</span>
                                <span className="text-[10px] text-muted-foreground font-medium opacity-80 leading-relaxed">{displayKpis.desvio.help}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
