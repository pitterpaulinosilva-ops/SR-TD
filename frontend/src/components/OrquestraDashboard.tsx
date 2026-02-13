import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, TrendingDown, Minus, Clock, CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";
import { useOrquestraData } from "@/hooks/useOrquestraData";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface OrquestraDashboardProps {
    title: string;
    description: string;
    tipo: string;
    icon: React.ReactNode;
    colorScheme?: 'red' | 'blue' | 'green';
}

const COLORS = {
    red: ['#ef4444', '#f87171', '#fee2e2'],
    blue: ['#3b82f6', '#60a5fa', '#dbeafe'],
    green: ['#22c55e', '#4ade80', '#dcfce7']
};

export function OrquestraDashboard({ title, description, tipo, icon, colorScheme = 'blue' }: OrquestraDashboardProps) {
    const { kpis, loading, error, rawData } = useOrquestraData({ tipo });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 border border-dashed rounded-xl bg-muted/5">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground font-medium">Consultando Banco Orquestra...</p>
                </div>
            </div>
        );
    }

    if (error || !kpis) return null;

    const chartData = [
        { name: 'Finalizados', value: kpis.finalizados },
        { name: 'Em Aberto', value: kpis.em_andamento }
    ];

    const colors = COLORS[colorScheme];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border">
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg",
                        colorScheme === 'red' ? 'bg-destructive/10 text-destructive' :
                            colorScheme === 'blue' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                    )}>
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-foreground/10 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">SQL Server</span>
                            <span className="text-xs text-muted-foreground">{description}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 px-4 text-right">
                    <div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total Geral</p>
                        <p className="text-xl font-black">{kpis.total.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats & distribution */}
                <Card className="lg:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Status da Demanda</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill={colors[0]} />
                                        <Cell fill={colors[2]} />
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                            <div className="p-2 rounded-lg bg-muted/20">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Taxa Sucesso</p>
                                <p className="text-lg font-black text-primary">{kpis.taxa_sucesso.toFixed(1)}%</p>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/20">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Reaberturas</p>
                                <p className="text-lg font-black text-amber-500">{kpis.reaberturas_media.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* KPIs Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                    {/* Tempo Médio */}
                    <div className={cn("p-6 rounded-2xl flex flex-col justify-between shadow-lg transition-transform hover:scale-[1.02]",
                        colorScheme === 'red' ? 'bg-gradient-to-br from-red-600 to-red-800' :
                            colorScheme === 'blue' ? 'bg-gradient-to-br from-blue-600 to-blue-800' :
                                'bg-gradient-to-br from-green-600 to-green-800'
                    )}>
                        <div className="flex justify-between items-start">
                            <Clock className="h-6 w-6 opacity-40" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Tempo de Resolução</span>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black tracking-tighter">{kpis.tempo_medio_resolucao.toFixed(1)}</span>
                                <span className="text-lg font-bold opacity-70">DIAS</span>
                            </div>
                            <p className="text-[10px] mt-2 font-medium opacity-80 leading-relaxed">
                                Média de dias desde a abertura até a conclusão final no Orquestra.
                            </p>
                        </div>
                    </div>

                    {/* Eficiência */}
                    <div className="p-6 rounded-2xl bg-slate-900 flex flex-col justify-between shadow-lg transition-transform hover:scale-[1.02]">
                        <div className="flex justify-between items-start">
                            <CheckCircle2 className="h-6 w-6 text-emerald-400 opacity-60" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Eficiência de Entrega</span>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black tracking-tighter text-emerald-400">
                                    {((kpis.finalizados / kpis.total) * 100).toFixed(0)}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div
                                    className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${(kpis.finalizados / kpis.total) * 100}%` }}
                                />
                            </div>
                            <p className="text-[10px] mt-4 font-medium text-slate-400 leading-relaxed uppercase tracking-wider">
                                {kpis.finalizados} ITENS FINALIZADOS DE {kpis.total} TOTAL
                            </p>
                        </div>
                    </div>

                    {/* Em Aberto */}
                    <Card className="hover:shadow-md transition-all border-l-4 border-l-amber-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Atendimento Atual</p>
                                    <p className="text-4xl font-black text-amber-500">{kpis.em_andamento}</p>
                                </div>
                                <AlertCircle className="h-10 w-10 text-amber-500/20" />
                            </div>
                            <p className="text-[10px] mt-4 text-muted-foreground italic font-medium leading-relaxed">
                                Demandas que constam com status "Em andamento" no Banco SQL.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Reaberturas */}
                    <Card className="hover:shadow-md transition-all border-l-4 border-l-indigo-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Prevenção de Retrabalho</p>
                                    <p className="text-4xl font-black text-indigo-500">
                                        {kpis.taxa_sucesso.toFixed(0)}%
                                    </p>
                                </div>
                                <RefreshCcw className="h-10 w-10 text-indigo-500/20" />
                            </div>
                            <p className="text-[10px] mt-4 text-muted-foreground font-medium leading-relaxed">
                                Porcentagem de solicitações resolvidas sem necessidade de reabertura.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
