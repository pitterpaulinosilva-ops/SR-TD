import { Phase, Item } from "./timeline";

export interface Program {
    id: string;
    title: string;
    description?: string;
    image?: string;

    // Campos do Cabeçalho
    projectName: string;
    objective: string;
    directorate?: string;
    macroprocess?: string;
    process?: string;
    subprocess?: string;
    processOwner?: string;
    productOwner?: string;

    // Financeiro e KPIs
    budget?: number;
    spent?: number;
    sprintStatus?: string;
    lastSprint?: string;

    // Dados
    phases: Phase[];
    risks: Item[];
    lessons: Item[];

    createdAt: string;
    updatedAt: string;
    projectIds: string[];
}
