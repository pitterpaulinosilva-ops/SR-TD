
export interface OrquestraItem {
    Instancia: number;
    Tipo_Solicitacao: string;
    Nivel: string;
    Dt_Abertura: string;
    Dt_Conclusao: string;
    Sistema: string;
    Qnt_Reabertura: number;
    Situacao: string;
}

export interface OrquestraKPIs {
    total: number;
    finalizados: number;
    em_andamento: number;
    tempo_medio_resolucao: number; // dias
    reaberturas_media: number;
    taxa_sucesso: number; // % finalizados sem reabertura (ou simplificado)
}

export class OrquestraService {
    private static cachedData: OrquestraItem[] | null = null;

    static async loadData(): Promise<OrquestraItem[]> {
        if (this.cachedData) return this.cachedData;
        try {
            // Ajustando o caminho para o local real do arquivo no projeto
            const response = await fetch('/src/data/dados_orquestra.json');
            if (!response.ok) throw new Error('Erro ao carregar dados do Orquestra');
            const data = await response.json();
            this.cachedData = data;
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    static calcularKPIs(items: OrquestraItem[]): OrquestraKPIs {
        if (items.length === 0) return {
            total: 0, finalizados: 0, em_andamento: 0,
            tempo_medio_resolucao: 0, reaberturas_media: 0, taxa_sucesso: 0
        };

        const finalizados = items.filter(i => i.Situacao === 'Finalizado');
        const emAndamento = items.filter(i => i.Situacao === 'Em andamento');

        // Tempo Médio de Resolução (dias)
        let totalDias = 0;
        let countComData = 0;

        finalizados.forEach(item => {
            if (item.Dt_Abertura && item.Dt_Conclusao) {
                const abertura = new Date(item.Dt_Abertura.replace(' ', 'T'));
                const conclusao = new Date(item.Dt_Conclusao.replace(' ', 'T'));
                const diff = (conclusao.getTime() - abertura.getTime()) / (1000 * 60 * 60 * 24);
                if (diff >= 0) {
                    totalDias += diff;
                    countComData++;
                }
            }
        });

        const tempoMedio = countComData > 0 ? totalDias / countComData : 0;
        const totalReaberturas = items.reduce((acc, curr) => acc + (curr.Qnt_Reabertura || 0), 0);
        const semReabertura = finalizados.filter(i => i.Qnt_Reabertura === 0).length;

        return {
            total: items.length,
            finalizados: finalizados.length,
            em_andamento: emAndamento.length,
            tempo_medio_resolucao: tempoMedio,
            reaberturas_media: totalReaberturas / items.length,
            taxa_sucesso: finalizados.length > 0 ? (semReabertura / finalizados.length) * 100 : 0
        };
    }
}
