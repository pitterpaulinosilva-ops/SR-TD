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
    risks: Item[];
    lessons: Item[];
    date: string;
    phases: Phase[];
    createdAt: string;
}
