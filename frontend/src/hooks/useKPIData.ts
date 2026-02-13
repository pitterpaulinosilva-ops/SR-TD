import { useState, useEffect } from 'react';
import { AzureDataService } from '@/services/azureDataService';
import { prepararDados, calcularKPIs, WorkItem, ProcessedWorkItem, KPIDashboardData } from '@/lib/kpi_engine';

interface UseKPIDataOptions {
    sprintNum?: number;
    workItemTypes?: string[];
    autoLoad?: boolean;
}

interface UseKPIDataReturn {
    kpis: KPIDashboardData | null;
    rawData: WorkItem[];
    processedData: ProcessedWorkItem[];
    loading: boolean;
    error: Error | null;
    availableSprints: number[];
    reload: () => Promise<void>;
}

/**
 * Hook customizado para carregar e calcular KPIs
 */
export function useKPIData(options: UseKPIDataOptions = {}): UseKPIDataReturn {
    const { sprintNum, workItemTypes, autoLoad = true } = options;

    const [rawData, setRawData] = useState<WorkItem[]>([]);
    const [processedData, setProcessedData] = useState<ProcessedWorkItem[]>([]);
    const [kpis, setKpis] = useState<KPIDashboardData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [availableSprints, setAvailableSprints] = useState<number[]>([]);

    const loadAndCalculate = async () => {
        setLoading(true);
        setError(null);

        try {
            // 1. Carregar dados brutos
            let data = await AzureDataService.loadData();

            // 2. Filtrar por sprint se especificado
            if (sprintNum !== undefined) {
                data = AzureDataService.filterBySprint(data, sprintNum);
            }

            // 2.1 Filtrar por tipos se especificado
            if (workItemTypes && workItemTypes.length > 0) {
                data = data.filter(item => workItemTypes.includes(item.type));
            }

            setRawData(data);

            // 3. Preparar dados (converter datas, extrair sprints)
            const prepared = prepararDados(data);
            setProcessedData(prepared);

            // 4. Calcular KPIs
            const calculatedKpis = calcularKPIs(prepared);
            setKpis(calculatedKpis);

            // 5. Obter sprints disponíveis
            const allData = await AzureDataService.loadData();
            const sprints = AzureDataService.getAvailableSprints(allData);
            setAvailableSprints(sprints);

        } catch (err) {
            setError(err instanceof Error ? err : new Error('Erro desconhecido'));
            console.error('Erro ao carregar KPIs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoLoad) {
            loadAndCalculate();
        }
    }, [sprintNum, workItemTypes, autoLoad]);

    return {
        kpis,
        rawData,
        processedData,
        loading,
        error,
        availableSprints,
        reload: loadAndCalculate
    };
}
