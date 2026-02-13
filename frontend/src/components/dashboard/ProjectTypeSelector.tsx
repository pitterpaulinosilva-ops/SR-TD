import { FileText, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ProjectTypeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (type: "project" | "program") => void;
}

const SelectionCard = ({
    icon: Icon,
    title,
    description,
    onClick
}: {
    icon: typeof FileText;
    title: string;
    description: string;
    onClick: () => void;
}) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center p-8 gap-6 h-full w-full",
                "bg-white transition-all duration-300",
                "border border-slate-200", // Lighter border as per image
                "hover:border-[#004C97] hover:shadow-lg hover:-translate-y-1",
                "group text-center"
            )}
        >
            <div className="p-5 bg-slate-50 group-hover:bg-[#004C97]/5 transition-colors">
                <Icon className="h-10 w-10 text-slate-700 group-hover:text-[#004C97] transition-colors" strokeWidth={1.5} />
            </div>
            <div className="space-y-3 max-w-[240px]">
                <h3 className="text-xl font-bold font-display text-slate-900 group-hover:text-[#004C97] transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 font-sans leading-relaxed">
                    {description}
                </p>
            </div>
        </button>
    );
};

export function ProjectTypeSelector({ open, onOpenChange, onSelect }: ProjectTypeSelectorProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl sm:rounded-none border-slate-200">
                <DialogHeader className="space-y-4 pb-4 border-b border-slate-100">
                    <DialogTitle className="text-2xl font-display font-bold text-slate-900 text-center">
                        Novo Item
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-500">
                        Selecione o tipo de item que deseja criar para começar.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    <SelectionCard
                        icon={FileText}
                        title="Projeto"
                        description="Crie um novo Status Report para um projeto individual com cronograma e riscos."
                        onClick={() => onSelect("project")}
                    />
                    <SelectionCard
                        icon={Layers}
                        title="Programa"
                        description="Agrupe múltiplos projetos em uma visão consolidada de programa."
                        onClick={() => onSelect("program")}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
