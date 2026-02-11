import { useState } from "react";
import { AlertTriangle, Lightbulb, Plus, Trash2, X, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item } from "@/types/timeline";
import { cn } from "@/lib/utils";

interface EditableListProps {
  items: Item[];
  onUpdate: (items: Item[]) => void;
  icon: React.ElementType;
  title: string;
  placeholder: string;
  colorClass: string;
  bgClass: string;
  borderColor: string;
  readOnly?: boolean;
}

const EditableList = ({
  items = [],
  onUpdate,
  icon: Icon,
  title,
  placeholder,
  colorClass,
  bgClass,
  borderColor,
  readOnly
}: EditableListProps) => {
  const [newItemText, setNewItemText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newItemText.trim()) {
      const newItem: Item = {
        id: Math.random().toString(36).substr(2, 9),
        text: newItemText.trim()
      };
      onUpdate([...items, newItem]);
      setNewItemText("");
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  return (
    <div className={cn("bg-card rounded-xl border shadow-sm animate-fade-in flex flex-col h-full", borderColor)}>
      <div className="p-5 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", bgClass, colorClass)}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground tracking-tight">{title}</h3>
          </div>
          {!readOnly && (
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(!isAdding)} className={cn("hover:bg-background", colorClass)}>
              {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3">
        {isAdding && (
          <div className="bg-background p-3 rounded-lg border border-primary/20 shadow-sm animate-in fade-in slide-in-from-top-2">
            <Input
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder={placeholder}
              className="mb-2"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="h-7 text-xs">Cancelar</Button>
              <Button size="sm" onClick={handleAdd} className="h-7 text-xs bg-primary text-white">Adicionar</Button>
            </div>
          </div>
        )}

        {items.length === 0 && !isAdding ? (
          <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
            <Icon className="h-8 w-8 mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground italic">Nenhum item registrado.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="group flex items-start justify-between gap-3 p-3 rounded-lg bg-background border border-border/50 hover:border-primary/20 hover:shadow-sm transition-all duration-200">
                <div className="flex gap-3">
                  <div className={cn("mt-1 h-2 w-2 rounded-full shrink-0", colorClass.replace('text-', 'bg-'))} />
                  <span className="text-sm text-slate-700 leading-relaxed font-medium">{item.text}</span>
                </div>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

interface StrategicCardsProps {
  risks?: Item[];
  lessons?: Item[];
  onUpdateRisks?: (items: Item[]) => void;
  onUpdateLessons?: (items: Item[]) => void;
  readOnly?: boolean;
}

const StrategicCards = ({ risks = [], lessons = [], onUpdateRisks, onUpdateLessons, readOnly = false }: StrategicCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EditableList
        title="Riscos e Pontos de Atenção"
        icon={AlertTriangle}
        items={risks}
        onUpdate={onUpdateRisks || (() => { })}
        placeholder="Descreva um novo risco..."
        colorClass="text-red-600"
        bgClass="bg-red-50"
        borderColor="border-red-100"
        readOnly={readOnly}
      />

      <EditableList
        title="Principais Entregas e Lições"
        icon={Lightbulb}
        items={lessons}
        onUpdate={onUpdateLessons || (() => { })}
        placeholder="Descreva uma lição aprendida..."
        colorClass="text-amber-600"
        bgClass="bg-amber-50"
        borderColor="border-amber-100"
        readOnly={readOnly}
      />
    </div>
  );
};

export default StrategicCards;
