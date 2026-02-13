import { DollarSign, Activity, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CostChart = () => {
  const maxValue = 700;
  const realizedValue = 642.5;
  const percentage = (realizedValue / maxValue) * 100;
  const ticks = [0, 100, 200, 300, 400, 500, 600, 700];

  return (
    <Card className="shadow-sm border-border hover:shadow-md transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Investimento (Milhares)
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <DollarSign className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-2xl font-bold text-foreground">R$ 642,5 k</span>
          <span className="text-xs text-muted-foreground">de R$ 700,0 k</span>
        </div>

        <div className="space-y-2">
          <div className="h-2.5 w-full bg-muted/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20" />
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-muted-foreground/60 font-medium font-mono">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
          <TrendingUp className="h-3 w-3 text-green-500" />
          <span className="text-green-600 font-medium">Dentro do Orçamento</span>
        </p>
      </CardContent>
    </Card>
  );
};

interface ExecutionGaugeProps {
  progress: number;
}

const ExecutionGauge = ({ progress }: ExecutionGaugeProps) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="shadow-sm border-border hover:shadow-md transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Avanço Físico
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
          <Activity className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <div className="relative h-24 w-24 flex-shrink-0">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              className="text-muted/30"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
            <circle
              className={cn("transition-all duration-1000 ease-out",
                progress === 100 ? "text-green-500" : "text-blue-600"
              )}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl font-bold text-foreground">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium text-foreground">Status Geral</h4>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Progresso ponderado de todas as entregas.</span>
            {progress === 100 ? (
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-fit">Entrega Finalizada</span>
            ) : (
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">Em Execução</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SprintStatus = () => {
  return (
    <Card className="shadow-sm border-border hover:shadow-md transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Sprint Atual
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
          <Zap className="h-4 w-4 text-amber-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-4 text-center space-y-2">
          <div className="p-2 bg-amber-50 rounded-full">
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Sem Sprint Ativa</p>
            <p className="text-xs text-muted-foreground max-w-[180px] mx-auto">
              O projeto não possui sprints configuradas ou iniciadas no momento.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface KpiCardsProps {
  totalProgress?: number;
}

const KpiCards = ({ totalProgress = 0 }: KpiCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CostChart />
      <ExecutionGauge progress={totalProgress} />
      <SprintStatus />
    </div>
  );
};

export default KpiCards;
