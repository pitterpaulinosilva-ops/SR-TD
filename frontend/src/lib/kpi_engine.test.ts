import { describe, it, expect } from 'vitest';
import { calcularKPIs, prepararDados, WorkItem, CAMPO_PROSPECTAR, CAMPO_ANALISE } from './kpi_engine';

describe('KPI Engine', () => {
    // Mock Data
    const mockItems: WorkItem[] = [
        {
            id: 1,
            title: 'Item 1',
            state: 'Closed',
            type: 'Feature',
            iteration: 'Sprint 36',
            createdDate: '2026-02-01T10:00:00Z',
            closedDate: '2026-02-10T10:00:00Z',
            [CAMPO_PROSPECTAR]: '2026-02-01T10:00:00Z',
            [CAMPO_ANALISE]: '2026-02-03T10:00:00Z', // 2 dias de diferença
            tipoSolucao: 'Implantação'
        },
        {
            id: 2,
            title: 'Item 2',
            state: 'Closed',
            type: 'Epic', // Epic conta para implantação
            iteration: 'Sprint 36',
            createdDate: '2026-02-05T10:00:00Z',
            closedDate: '2026-02-20T10:00:00Z', // Fora do prazo (Sprint 36 acaba 13/02 + 1 dia tol = 14/02)
            [CAMPO_PROSPECTAR]: '2026-02-05T10:00:00Z',
            [CAMPO_ANALISE]: '2026-02-06T10:00:00Z', // 1 dia de diferença
            tipoSolucao: 'Desenvolvimento'
        }
    ];

    it('deve calcular o Tempo Médio de Análise corretamente', () => {
        const preparados = prepararDados(mockItems);
        const kpis = calcularKPIs(preparados);

        // (2 + 1) / 2 = 1.5 dias
        expect(kpis.tempo_medio.valor).toBe(1.5);
    });

    it('deve calcular a Taxa de Implantação corretamente', () => {
        const preparados = prepararDados(mockItems);
        const kpis = calcularKPIs(preparados);

        // Apenas item 2 é Epic.
        // Item 2 é 'Desenvolvimento'.
        // Implantação = 0, Dev = 1. Total = 1.
        // Taxa = 0%
        expect(kpis.implantacao.valor).toBe(0);
        expect(kpis.implantacao.msg).toContain('0 Impl. | 1 Dev.');
    });

    it('deve calcular o Cronograma corretamente', () => {
        // Sprint 36 acaba em 2026-02-13. Tolerância até 14/02.
        // Item 1: Closed 10/02 -> No prazo.
        // Item 2: Closed 20/02 -> Atrasado.
        const preparados = prepararDados(mockItems);
        const kpis = calcularKPIs(preparados);

        // 1 no prazo, 1 atrasado. Total 2.
        // 50%
        expect(kpis.cronograma.valor).toBe(50);
        expect(kpis.cronograma.msg).toContain('(1/2)');
    });

    it('deve calcular o Desvio de Escopo corretamente', () => {
        // Sprint 36 (baseado no calendário hardcoded):
        // Limit: 2026-02-13
        // Start: Limit Sprint 35 (23/01) + 1 dia = 24/01/2026

        // Item 1 criado em 01/02 > 24/01 => Não planejado?
        // Vamos verificar a lógica de Start Date.

        const preparados = prepararDados(mockItems);
        const startSprint36 = preparados[0].sprint_start;
        // Se Sprint 35 termina 23/01, Sprint 36 começa 24/01.

        // Item 1: 01/02 > 24/01. -> Não planejado.
        // Item 2: 05/02 > 24/01. -> Não planejado.

        // Se todos são "Não Planejados", qtd_planejado = 0.
        // Divisão por zero resulta em 0 na lógica implementada.

        const kpis = calcularKPIs(preparados);
        expect(kpis.desvio.valor).toBe(0);
    });
});
