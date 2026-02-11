import { Activity, Phase } from "@/types/timeline";

export const initialPhases: Phase[] = [
    {
        id: "phase-1",
        name: "Fase 1 — Prospecção e Planejamento",
        progress: 10,
        activities: [
            { id: "a1", name: "Levantamento de Requisitos e Prospecção", status: "Entregue", date: "23/01/2025" },
            { id: "a2", name: "Análise de Aderência", status: "Entregue", date: "28/03/2025" },
            { id: "a3", name: "Termo de Solicitação de Contratação (TSC)", status: "Entregue", date: "01/12/2025" },
            { id: "a4", name: "Aguardar Processo Licitatório", status: "Em andamento" },
            { id: "a5", name: "Prova de Conceito e Contratação", status: "Não iniciado" },
        ],
    },
    {
        id: "phase-2",
        name: "Fase 2 — Execução",
        progress: 0,
        activities: [
            { id: "a6", name: "Kick-off do Projeto", status: "Não iniciado" },
            { id: "a7", name: "Implantar Solução", status: "Não iniciado" },
        ],
    },
    {
        id: "phase-3",
        name: "Fase 3 — Encerramento",
        progress: 0,
        activities: [
            { id: "a8", name: "Operação Assistida", status: "Não iniciado" },
        ],
    },
];
