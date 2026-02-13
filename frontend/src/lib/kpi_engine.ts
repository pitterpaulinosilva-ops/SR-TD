import { differenceInDays, parseISO, isValid, addDays, subDays } from 'date-fns';

// --- CONSTANTES ---
export const CAMPO_PROSPECTAR = "Custom.d583d2dc-0ad4-47a8-b36e-14c73ce0bb26";
export const CAMPO_ANALISE = "Custom.53fe01b9-fe2d-4e69-9cb7-a53b6e748c0e";
export const CAMPO_TIPO_SOLUCAO = "tipoSolucao"; // Já mapeado no extrator

// --- CALENDÁRIO DE SPRINTS ---
const SPRINT_CALENDAR: Record<number, string> = {
    36: "2026-02-13", 35: "2026-01-23", 34: "2025-12-12",
    33: "2025-11-21", 32: "2025-10-31", 31: "2025-10-10",
    30: "2025-09-19", 29: "2025-08-29", 28: "2025-08-08"
};

// --- INTERFACES ---
export interface WorkItem {
    id: number;
    title: string;
    state: string;
    type: string;
    iteration: string;
    createdDate?: string | Date;
    activatedDate?: string | Date;
    closedDate?: string | Date;
    tipoSolucao?: string;
    [key: string]: any;
}

export interface ProcessedWorkItem extends WorkItem {
    sprint_num?: number;
    sprint_end?: Date;
    sprint_start?: Date;
    sprint_end_tol?: Date;
    parsed_createdDate?: Date;
    parsed_closedDate?: Date;
    parsed_prospectar?: Date;
    parsed_analise?: Date;
}

export interface KPIResult {
    valor: number;
    msg?: string;
    cor?: string; // 'normal' | 'off' | 'inverse' na lógica original, adaptado para UI
    classificacao?: string;
    unidade?: string;
    help?: string;
}

export interface KPIDashboardData {
    tempo_medio: KPIResult;
    implantacao: KPIResult;
    cronograma: KPIResult;
    desvio: KPIResult;
}

// --- FUNÇÕES AUXILIARES ---

function getLimitDate(sprintNum: number): Date {
    if (SPRINT_CALENDAR[sprintNum]) {
        return parseISO(SPRINT_CALENDAR[sprintNum]);
    }
    // Fallback: 21 dias por sprint a partir da sprint 36
    const diffSprints = 36 - sprintNum;
    const baseDate = parseISO(SPRINT_CALENDAR[36]);
    return subDays(baseDate, diffSprints * 21);
}

function getStartDate(sprintNum: number): Date {
    const prevLimit = getLimitDate(sprintNum - 1);
    return addDays(prevLimit, 1);
}

function parseDate(dateStr: string | Date | undefined): Date | undefined {
    if (!dateStr) return undefined;
    if (dateStr instanceof Date) return dateStr;
    const d = parseISO(dateStr);
    return isValid(d) ? d : undefined;
}

export function prepararDados(items: WorkItem[]): ProcessedWorkItem[] {
    return items.map(item => {
        const processed: ProcessedWorkItem = { ...item };

        // Converter Datas
        processed.parsed_createdDate = parseDate(item.createdDate);
        processed.parsed_closedDate = parseDate(item.closedDate);
        processed.parsed_prospectar = parseDate(item[CAMPO_PROSPECTAR]);
        processed.parsed_analise = parseDate(item[CAMPO_ANALISE]);

        // Extrair Sprint
        const sprintMatch = item.iteration?.match(/Sprint (\d+)/);
        if (sprintMatch) {
            const sprintNum = parseInt(sprintMatch[1], 10);
            processed.sprint_num = sprintNum;
            processed.sprint_end = getLimitDate(sprintNum);
            processed.sprint_start = getStartDate(sprintNum);
            processed.sprint_end_tol = addDays(processed.sprint_end, 1);
        }

        return processed;
    });
}

export function calcularKPIs(items: ProcessedWorkItem[]): KPIDashboardData {
    const resultados: Partial<KPIDashboardData> = {};

    // 1. TEMPO MÉDIO DE ANÁLISE
    // (Prospectar - Análise).abs().mean()
    const itemsComDatasAnalise = items.filter(i => i.parsed_prospectar && i.parsed_analise);
    let totalDias = 0;
    if (itemsComDatasAnalise.length > 0) {
        totalDias = itemsComDatasAnalise.reduce((acc, curr) => {
            const diff = Math.abs(differenceInDays(curr.parsed_prospectar!, curr.parsed_analise!));
            return acc + diff;
        }, 0) / itemsComDatasAnalise.length;
    }

    resultados.tempo_medio = {
        valor: totalDias,
        unidade: 'dias',
        help: "Média da diferença absoluta entre Data Prospectar e Data Análise."
    };

    // 2. TAXA DE IMPLANTAÇÃO
    const epics = items.filter(i => i.type === 'Epic');
    let kpiImplantacao = 0;
    let msgImpl = "Sem dados";
    let corImpl = "off";
    let classImpl = "";

    if (epics.length > 0) {
        const impl = epics.filter(e => e.tipoSolucao?.trim().toLowerCase() === 'implantação').length;
        const dev = epics.filter(e => e.tipoSolucao?.trim().toLowerCase() === 'desenvolvimento').length;
        const total = impl + dev;

        if (total > 0) {
            kpiImplantacao = (impl / total) * 100;
            msgImpl = `${impl} Impl. | ${dev} Dev.`;

            if (kpiImplantacao > 60) { corImpl = "green"; classImpl = "Foco em Entrega"; }
            else if (kpiImplantacao < 40) { corImpl = "red"; classImpl = "Foco em Desenvolvimento"; }
            else { corImpl = "yellow"; classImpl = "Equilíbrio"; }
        }
    }

    resultados.implantacao = {
        valor: kpiImplantacao,
        msg: msgImpl,
        cor: corImpl,
        classificacao: classImpl
    };

    // 3. CRONOGRAMA
    // Entregas no prazo / Total fechado na sprint
    // Nota: A lógica Python filtrava por sprint ANTES de calcular. 
    // Aqui assumimos que 'items' JÁ FOI FILTRADO pela sprint desejada no componente pai.
    const entregues = items.filter(i => i.parsed_closedDate && i.sprint_num);
    let kpiCronograma = 0;
    let corCron = "off";
    let msgCron = "Sem dados";

    if (entregues.length > 0) {
        const noPrazo = entregues.filter(i => {
            // closedDate <= sprint_end_tol
            return i.parsed_closedDate! <= i.sprint_end_tol!;
        }).length;

        kpiCronograma = (noPrazo / entregues.length) * 100;

        let label = "";
        if (kpiCronograma >= 90) { corCron = "green"; label = "Excelente"; }
        else if (kpiCronograma >= 70) { corCron = "yellow"; label = "Razoável"; }
        else { corCron = "red"; label = "Baixo Cumprimento"; }

        msgCron = `${label} (${noPrazo}/${entregues.length})`;
    }

    resultados.cronograma = {
        valor: kpiCronograma,
        msg: msgCron,
        cor: corCron,
        help: "Entregas no prazo / Total fechado na sprint."
    };

    // 4. DESVIO DE ESCOPO
    // Itens Novos / Itens Planejados
    const itemsValidosDesvio = items.filter(i => i.sprint_num && i.parsed_createdDate && i.sprint_start);
    let kpiDesvio = 0;
    let corDesvio = "off";
    let msgDesvio = "Sem dados";

    if (itemsValidosDesvio.length > 0) {
        // Planejado: Created < Sprint Start
        const planejados = itemsValidosDesvio.filter(i => i.parsed_createdDate! < i.sprint_start!).length;
        const naoPlanejados = itemsValidosDesvio.length - planejados;

        if (planejados > 0) {
            kpiDesvio = (naoPlanejados / planejados) * 100;

            let label = "";
            if (kpiDesvio <= 10) { corDesvio = "green"; label = "Excelente"; }
            else if (kpiDesvio <= 30) { corDesvio = "yellow"; label = "Ajustes Naturais"; }
            else { corDesvio = "red"; label = "Alto Desvio"; }

            msgDesvio = `${label} (${naoPlanejados}/${planejados})`;
        }
    }

    resultados.desvio = {
        valor: kpiDesvio,
        msg: msgDesvio,
        cor: corDesvio,
        help: "Itens Novos / Itens Planejados."
    };

    return resultados as KPIDashboardData;
}
