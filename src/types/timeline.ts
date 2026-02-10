export type Status = "Entregue" | "Em andamento" | "Não iniciado";

export interface Activity {
    id: string;
    name: string;
    status: Status;
    date?: string;
}

export interface Phase {
    id: string;
    name: string;
    progress: number;
    activities: Activity[];
}

export interface Item {
    id: string;
    text: string;
}

export interface Report {
    id: string;
    title: string;
    projectName: string;
    objective: string;
    directorate?: string;
    // Campos para integração com Azure DevOps
    macroprocess?: string;
    process?: string;
    subprocess?: string;
    // Novos campos de papéis
    processOwner?: string;
    productOwner?: string;
    // Financeiro
    budget?: number;
    spent?: number;
    // Sprint
    lastSprint?: string;
    sprintStatus?: string;
    risks: Item[];
    lessons: Item[];
    date: string;
    phases: Phase[];
    createdAt: string;
}
