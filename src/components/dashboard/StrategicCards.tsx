import { useState } from "react";
import { AlertTriangle, Lightbulb, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item } from "@/types/timeline";

interface EditableListProps {
  items: Item[];
  onUpdate: (items: Item[]) => void;
  icon: React.ElementType;
  title: string;
  placeholder: string;
  colorClass: string;
  bgClass: string;
  readOnly?: boolean;
}

const EditableList = ({ items = [], onUpdate, icon: Icon, title, placeholder, colorClass, bgClass, readOnly }: EditableListProps) => {
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
    <div className="bg-card rounded-xl p-6 shadow-card border border-border animate-fade-in h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${bgClass}`}>
            <Icon className={`h-4 w-4 ${colorClass}`} />
          </div>
          <h3 className="font-semibold text-card-foreground">{title}</h3>
        </div>
        {!readOnly && (
          <Button size="sm" variant="ghost" onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <div className="space-y-3 flex-1">
        {isAdding && (
          <div className="flex gap-2 animate-in fade-in zoom-in-95">
            <Input
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder={placeholder}
              className="h-8 text-sm"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button size="sm" onClick={handleAdd} className="h-8 px-2">Adicionar</Button>
          </div>
        )}

        {items.length === 0 && !isAdding ? (
          <p className="text-sm text-muted-foreground italic">Nenhum item registrado.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="group flex items-start justify-between gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted/50">
                <div className="flex gap-2">
                  <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${colorClass}`} />
                  <span>{item.text}</span>
                </div>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
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
        colorClass="text-destructive"
        bgClass="bg-destructive/10"
        readOnly={readOnly}
      />

      <EditableList
        title="Principais Entregas / Lições Aprendidas"
        icon={Lightbulb}
        items={lessons}
        onUpdate={onUpdateLessons || (() => { })}
        placeholder="Descreva uma lição aprendida..."
        colorClass="text-primary"
        bgClass="bg-primary/10"
        readOnly={readOnly}
      />
    </div>
  );
};

export default StrategicCards;
