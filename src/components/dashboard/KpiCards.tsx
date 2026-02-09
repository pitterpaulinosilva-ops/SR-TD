import { DollarSign, Activity, Zap } from "lucide-react";

const CostChart = () => {
  const maxValue = 700;
  const realizedValue = 642.5;
  const percentage = (realizedValue / maxValue) * 100;
  const ticks = [0, 100, 200, 300, 400, 500, 600, 700];

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <DollarSign className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-semibold text-card-foreground">Custo do Projeto</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Previsto</span>
          <span className="font-bold text-card-foreground text-lg">R$ 642,50</span>
        </div>
        <div className="relative h-8 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 gradient-primary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground drop-shadow-sm">R$ 642,50</span>
          </div>
        </div>
        <div className="flex justify-between">
          {ticks.filter((_, i) => i % 2 === 0).map((tick) => (
            <span key={tick} className="text-[10px] text-muted-foreground">R$ {tick}</span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 italic">
          Monitoramento do orçamento executado do projeto.
        </p>
      </div>
    </div>
  );
};

interface ExecutionGaugeProps {
  progress: number;
}

const ExecutionGauge = ({ progress }: ExecutionGaugeProps) => {
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-accent/10">
          <Activity className="h-4 w-4 text-accent" />
        </div>
        <h3 className="font-semibold text-card-foreground">Execução Total</h3>
      </div>
      <div className="flex items-center justify-center py-2">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke="url(#gaugeGradient)" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-card-foreground">{Math.round(progress)}%</span>
            <span className="text-xs text-muted-foreground">concluído</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SprintStatus = () => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border animate-fade-in" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-warning/10">
          <Zap className="h-4 w-4 text-warning" />
        </div>
        <h3 className="font-semibold text-card-foreground">Última Sprint</h3>
      </div>
      <div className="flex items-center justify-center h-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Não houve sprint</span>
          </div>
          <p className="text-xs text-muted-foreground">Nenhuma sprint realizada até o momento</p>
        </div>
      </div>
    </div>
  );
};

interface KpiCardsProps {
  totalProgress?: number;
}

const KpiCards = ({ totalProgress = 0 }: KpiCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CostChart />
      <ExecutionGauge progress={totalProgress} />
      <SprintStatus />
    </div>
  );
};

export default KpiCards;
