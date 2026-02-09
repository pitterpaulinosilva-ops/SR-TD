import { Report, Item } from "@/types/timeline";
import { initialPhases } from "@/data/initialData";

const STORAGE_KEY = "health-reports";

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultReportFields = {
    projectName: "Novo Sistema de Saúde",
    objective: "Implementação da nova plataforma de gestão de saúde ocupacional para as unidades SESI e SENAI.",
    risks: [
        { id: "r1", text: "Atraso no processo licitatório devido a burocracia interna" }
    ],
    lessons: [
        { id: "l1", text: "Necessidade de envolver o time jurídico desde o início do planejamento" }
    ],
    directorate: "",
};

export const reportService = {
    getAll: (): Report[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            const defaultReport: Report = {
                id: "default-1",
                title: "Novo Sistema de Saúde - Inicial",
                date: new Date().toLocaleDateString("pt-BR"),
                phases: JSON.parse(JSON.stringify(initialPhases)),
                createdAt: new Date().toISOString(),
                ...defaultReportFields
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultReport]));
            return [defaultReport];
        }

        // Parse and migrate old data
        const reports = JSON.parse(data);
        return reports.map((r: any) => ({
            ...defaultReportFields,
            ...r,
            risks: Array.isArray(r.risks) ? r.risks : defaultReportFields.risks,
            lessons: Array.isArray(r.lessons) ? r.lessons : defaultReportFields.lessons,
            projectName: r.projectName || defaultReportFields.projectName,
            objective: r.objective || defaultReportFields.objective,
            directorate: r.directorate || defaultReportFields.directorate
        }));
    },

    getById: (id: string): Report | undefined => {
        const reports = reportService.getAll();
        return reports.find((r) => r.id === id);
    },

    create: (title: string): Report => {
        const reports = reportService.getAll();
        const newReport: Report = {
            id: generateId(),
            title: title || "Novo Status Report",
            date: new Date().toLocaleDateString("pt-BR"),
            phases: JSON.parse(JSON.stringify(initialPhases)),
            createdAt: new Date().toISOString(),
            // New fields with defaults (empty for new reports to enforce user input or use defaults?)
            // Let's use defaults to verify visualization first
            ...defaultReportFields,
            risks: [], // Start empty for new reports as requested? Or with example? Let's start empty.
            lessons: []
        };

        reports.push(newReport);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
        return newReport;
    },

    update: (id: string, updates: Partial<Report>): Report | null => {
        const reports = reportService.getAll();
        const index = reports.findIndex((r) => r.id === id);

        if (index === -1) return null;

        const updatedReport = { ...reports[index], ...updates };
        reports[index] = updatedReport;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
        return updatedReport;
    },

    delete: (id: string): void => {
        let reports = reportService.getAll();
        reports = reports.filter((r) => r.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    },
};
