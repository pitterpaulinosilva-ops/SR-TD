import { useState, useEffect, useMemo } from 'react';
import { OrquestraService, OrquestraItem, OrquestraKPIs } from '@/services/orquestraService';

interface UseOrquestraDataOptions {
    tipo?: 'Bug' | 'Melhoria' | 'Ajuste' | string;
    sistema?: string;
}

export function useOrquestraData(options: UseOrquestraDataOptions = {}) {
    const { tipo, sistema } = options;
    const [rawData, setRawData] = useState<OrquestraItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                let data = await OrquestraService.loadData();

                // Mapeamento: "Ajuste" costuma ser Bug em sistemas de ticket
                if (tipo) {
                    data = data.filter(i => i.Tipo_Solicitacao === tipo);
                }

                if (sistema) {
                    data = data.filter(i => i.Sistema === sistema);
                }

                setRawData(data);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Erro SQL Orquestra'));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [tipo, sistema]);

    const kpis = useMemo(() => OrquestraService.calcularKPIs(rawData), [rawData]);

    return { rawData, kpis, loading, error };
}
