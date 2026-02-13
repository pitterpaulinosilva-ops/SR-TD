import pandas as pd
from datetime import datetime, timedelta

# --- CONSTANTES DE CAMPOS (AZURE) ---
CAMPO_PROSPECTAR = "Custom.d583d2dc-0ad4-47a8-b36e-14c73ce0bb26"
CAMPO_ANALISE = "Custom.53fe01b9-fe2d-4e69-9cb7-a53b6e748c0e"
CAMPO_TIPO_SOLUCAO = "Custom.498a9288-7c85-4800-800d-2ed5b011eefd"

# --- CALENDÁRIO DE SPRINTS ---
# Ajuste conforme o projeto destino
SPRINT_CALENDAR = {
    36: "2026-02-13", 35: "2026-01-23", 34: "2025-12-12",
    33: "2025-11-21", 32: "2025-10-31", 31: "2025-10-10",
    30: "2025-09-19", 29: "2025-08-29", 28: "2025-08-08"
}

# --- FUNÇÕES AUXILIARES ---
def get_limit_date(sprint_num):
    if pd.isna(sprint_num): return None
    sprint_num = int(sprint_num)
    if sprint_num in SPRINT_CALENDAR:
        return datetime.strptime(SPRINT_CALENDAR[sprint_num], "%Y-%m-%d")
    # Lógica de fallback para sprints futuras/passadas (21 dias por sprint)
    return datetime(2026, 2, 13) - timedelta(days=(36 - sprint_num)*21)

def get_start_date(sprint_num):
    prev = get_limit_date(sprint_num - 1)
    return prev + timedelta(days=1) if prev else None

def preparar_dataframe(df):
    """
    Prepara o DataFrame com as colunas calculadas necessárias para os KPIs.
    """
    # Converte colunas de data
    cols_data = ['closedDate', 'activatedDate', 'createdDate', CAMPO_PROSPECTAR, CAMPO_ANALISE]
    for col in cols_data:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce', utc=True).dt.tz_convert(None)

    # Extrai Sprint
    if 'iteration' in df.columns:
        df['sprint_num'] = df['iteration'].str.extract(r'Sprint (\d+)').astype(float)
        df['sprint_end'] = df['sprint_num'].apply(get_limit_date)
        df['sprint_start'] = df['sprint_num'].apply(get_start_date)
        df['sprint_end_tol'] = df['sprint_end'] + timedelta(days=1)
    
    return df

def calcular_kpis(df):
    """
    Calcula os 4 Indicadores Táticos e retorna um dicionário com valores e classificações.
    """
    resultados = {}

    # 1. TEMPO MÉDIO DE ANÁLISE
    if CAMPO_PROSPECTAR in df.columns and CAMPO_ANALISE in df.columns:
        df_analise = df.dropna(subset=[CAMPO_PROSPECTAR, CAMPO_ANALISE]).copy()
        kpi_tempo = (df_analise[CAMPO_PROSPECTAR] - df_analise[CAMPO_ANALISE]).abs().dt.total_seconds().mean() / 86400 if not df_analise.empty else 0
    else:
        kpi_tempo = 0
    
    resultados['tempo_medio'] = {
        'valor': kpi_tempo,
        'unidade': 'dias',
        'help': "Média da diferença absoluta entre Data Prospectar e Data Análise."
    }

    # 2. TAXA DE IMPLANTAÇÃO
    df_epics = df[df['type'] == 'Epic'].copy() if 'type' in df.columns else pd.DataFrame()
    if not df_epics.empty and 'tipoSolucao' in df_epics.columns:
        df_epics['tipo_norm'] = df_epics['tipoSolucao'].astype(str).str.strip().str.title()
        qtd_impl = len(df_epics[df_epics['tipo_norm'] == 'Implantação'])
        qtd_dev = len(df_epics[df_epics['tipo_norm'] == 'Desenvolvimento'])
        total = qtd_impl + qtd_dev
        kpi_implantacao = (qtd_impl / total * 100) if total > 0 else 0
        
        # Classificação
        if kpi_implantacao > 60: cor, msg = "normal", "Foco em Entrega"
        elif kpi_implantacao < 40: cor, msg = "inverse", "Foco em Desenvolvimento"
        else: cor, msg = "off", "Equilíbrio"
        
        resultados['implantacao'] = {
            'valor': kpi_implantacao,
            'msg': f"{qtd_impl} Impl. | {qtd_dev} Dev.",
            'cor': cor,
            'classificacao': msg
        }
    else:
        resultados['implantacao'] = {'valor': 0, 'msg': "Sem dados", 'cor': "off"}

    # 3. CRONOGRAMA
    df_entregues = df.dropna(subset=['closedDate', 'sprint_num']).copy()
    if not df_entregues.empty:
        df_entregues['atrasado'] = df_entregues['closedDate'] > df_entregues['sprint_end_tol']
        concluido_no_prazo = len(df_entregues[~df_entregues['atrasado']])
        total_entregues = len(df_entregues)
        kpi_cronograma = (concluido_no_prazo / total_entregues * 100)
        
        if kpi_cronograma >= 90: cor, msg = "normal", "Excelente"
        elif kpi_cronograma >= 70: cor, msg = "off", "Razoável"
        else: cor, msg = "inverse", "Baixo Cumprimento"
        
        resultados['cronograma'] = {
            'valor': kpi_cronograma,
            'msg': f"{msg} ({concluido_no_prazo}/{total_entregues})",
            'cor': cor,
            'classificacao': msg,
            'help': "Entregas no prazo / Total fechado na sprint."
        }
    else:
        resultados['cronograma'] = {'valor': 0, 'msg': "Sem dados", 'cor': "off"}

    # 4. DESVIO DE ESCOPO
    df_sprint = df.dropna(subset=['sprint_num', 'createdDate', 'sprint_start']).copy()
    if not df_sprint.empty:
        df_sprint['planejado'] = df_sprint['createdDate'] < df_sprint['sprint_start']
        qtd_planejado = len(df_sprint[df_sprint['planejado']])
        qtd_nao_planejado = len(df_sprint[~df_sprint['planejado']])
        kpi_desvio = (qtd_nao_planejado / qtd_planejado * 100) if qtd_planejado > 0 else 0
        
        if kpi_desvio <= 10: cor, msg = "normal", "Excelente"
        elif kpi_desvio <= 30: cor, msg = "off", "Ajustes Naturais"
        else: cor, msg = "inverse", "Alto Desvio"
        
        resultados['desvio'] = {
            'valor': kpi_desvio,
            'msg': f"{msg} ({qtd_nao_planejado}/{qtd_planejado})",
            'cor': cor,
            'classificacao': msg,
            'help': "Itens Novos / Itens Planejados."
        }
    else:
        resultados['desvio'] = {'valor': 0, 'msg': "Sem dados", 'cor': "off"}

    return resultados
