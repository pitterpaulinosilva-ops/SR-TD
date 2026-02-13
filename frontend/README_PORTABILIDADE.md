# 🧩 Pacote de Indicadores Táticos - Portabilidade

Este pacote contém os arquivos necessários para implantar o módulo de **Indicadores Táticos (Gestão por Valor)** em outro projeto.

## 📦 Arquivos Incluídos

1.  **`kpi_engine.py`**:
    *   Contém toda a lógica de cálculo dos indicadores:
        *   Tempo Médio de Análise (Prospectar - Análise)
        *   Taxa de Implantação
        *   Cumprimento de Cronograma (SLA e Cores)
        *   Desvio de Escopo
    *   Este arquivo **abstrai** as regras de negócio. Basta importar e usar.

2.  **`extrator_azure.js`**:
    *   Script Node.js para extrair dados do Azure DevOps.
    *   Já mapeia os campos customizados necessários (Prospectar/Análise).

## 🚀 Como Implantar no Novo Projeto

### Passo 1: Configuração
1.  Copie `kpi_engine.py` e `extrator_azure.js` para a raiz do novo projeto.
2.  Crie/Ajuste o arquivo `.env` com suas credenciais:
    ```env
    AZURE_PAT=seu_token
    AZURE_ORG_URL=https://dev.azure.com/suaorg
    AZURE_PROJECT=SeuProjeto
    ```
3.  Instale dependências Node.js (na pasta do extrator):
    ```bash
    npm install dotenv node-fetch
    ```

### Passo 2: Extração de Dados
Rode o extrator para gerar o JSON (`data/itens_completo.json`):
```bash
node extrator_azure.js
```

### Passo 3: Uso no Código Python
No seu dashboard (Streamlit, Flask, etc.), importe o motor de cálculo:

```python
import pandas as pd
import streamlit as st
from kpi_engine import preparar_dataframe, calcular_kpis

# 1. Carregar Dados
df = pd.read_json('data/itens_completo.json')

# 2. Preparar (Converte datas, extrai sprints)
df = preparar_dataframe(df)

# 3. Aplicar Filtros (Exemplo: Filtrar Sprint 36)
df_filtrado = df[df['sprint_num'] == 36]

# 4. Calcular KPIs
kpis = calcular_kpis(df_filtrado)

# 5. Exibir (Exemplo Streamlit)
st.metric("Tempo Médio", 
          f"{kpis['tempo_medio']['valor']:.1f} dias",
          help=kpis['tempo_medio']['help'])

st.metric("Cronograma", 
          f"{kpis['cronograma']['valor']:.1f}%", 
          kpis['cronograma']['msg'], # Texto explicativo (ex: Excelente 9/10)
          delta_color=kpis['cronograma']['cor']) # Cor automática (Verde/Vermelho)
```
    