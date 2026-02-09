import { AlertTriangle, BookOpen } from "lucide-react";

const StrategicCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Riscos */}
      <div
        className="bg-card rounded-xl border border-destructive/20 shadow-card p-6 animate-fade-in"
        style={{ animationDelay: "0.7s" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <h3 className="font-semibold text-card-foreground">Riscos</h3>
        </div>
        <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-4">
          <p className="text-sm text-card-foreground leading-relaxed">
            Atualmente está sendo verificada a possibilidade de <strong>reavaliar os requisitos
            anteriormente levantados</strong>, o que pode impactar o cronograma do projeto.
          </p>
        </div>
      </div>

      {/* Lições Aprendidas */}
      <div
        className="bg-card rounded-xl border border-border shadow-card p-6 animate-fade-in"
        style={{ animationDelay: "0.8s" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-info/10">
            <BookOpen className="h-4 w-4 text-info" />
          </div>
          <h3 className="font-semibold text-card-foreground">Lições Aprendidas</h3>
        </div>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-info mt-2 shrink-0" />
            <p className="text-sm text-card-foreground">
              <strong>Organização documental</strong> — A estruturação adequada da documentação
              desde o início facilita a tomada de decisão e a rastreabilidade do projeto.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StrategicCards;
