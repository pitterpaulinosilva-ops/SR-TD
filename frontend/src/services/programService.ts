import { Program } from "@/types/program";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "@sesi-senai-reports:programs";

export const programService = {
    getAll: (): Program[] => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    },

    getById: (id: string): Program | undefined => {
        const programs = programService.getAll();
        return programs.find(p => p.id === id);
    },

    create: (title: string, description?: string): Program => {
        const programs = programService.getAll();
        const newProgram: Program = {
            id: uuidv4(),
            title,
            description,
            // Header Defaults
            projectName: title,
            objective: "Objetivo do Programa Estratégico...",

            // Data Defaults
            phases: [],
            risks: [],
            lessons: [],
            projectIds: [],

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const updatedPrograms = [...programs, newProgram];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrograms));
        return newProgram;
    },

    update: (id: string, updates: Partial<Program>): Program | undefined => {
        const programs = programService.getAll();
        const index = programs.findIndex(p => p.id === id);

        if (index === -1) return undefined;

        const updatedProgram = {
            ...programs[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        programs[index] = updatedProgram;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
        return updatedProgram;
    },

    delete: (id: string): void => {
        const programs = programService.getAll();
        const filtered = programs.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
};
