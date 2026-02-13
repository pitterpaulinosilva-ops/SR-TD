import { WorkItem } from '@/lib/kpi_engine';

/**
 * Serviço para carregar dados do Azure DevOps extraídos
 */
export class AzureDataService {
    private static cachedData: WorkItem[] | null = null;

    /**
     * Carrega os dados do arquivo JSON extraído
     */
    static async loadData(): Promise<WorkItem[]> {
        if (this.cachedData) {
            return this.cachedData;
        }

        try {
            // Em produção, isso virá de uma API
            // Por enquanto, carregamos do arquivo estático
            const response = await fetch('/data/itens_completo.json');

            if (!response.ok) {
                throw new Error(`Erro ao carregar dados: ${response.statusText}`);
            }

            const data = await response.json();
            this.cachedData = data;
            return data;
        } catch (error) {
            console.error('Erro ao carregar dados do Azure:', error);
            throw error;
        }
    }

    /**
     * Filtra itens por sprint
     */
    static filterBySprint(items: WorkItem[], sprintNum: number): WorkItem[] {
        return items.filter(item => {
            const match = item.iteration?.match(/Sprint (\d+)/);
            return match && parseInt(match[1], 10) === sprintNum;
        });
    }

    /**
     * Filtra itens por tipo
     */
    static filterByType(items: WorkItem[], type: string): WorkItem[] {
        return items.filter(item => item.type === type);
    }

    /**
     * Filtra itens por estado
     */
    static filterByState(items: WorkItem[], state: string): WorkItem[] {
        return items.filter(item => item.state === state);
    }

    /**
     * Obtém lista única de sprints disponíveis
     */
    static getAvailableSprints(items: WorkItem[]): number[] {
        const sprints = new Set<number>();

        items.forEach(item => {
            const match = item.iteration?.match(/Sprint (\d+)/);
            if (match) {
                sprints.add(parseInt(match[1], 10));
            }
        });

        return Array.from(sprints).sort((a, b) => b - a); // Ordem decrescente
    }

    /**
     * Limpa o cache (útil para forçar reload)
     */
    static clearCache(): void {
        this.cachedData = null;
    }
}
