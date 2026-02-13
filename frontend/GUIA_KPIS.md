# 📊 Sistema de KPIs Táticos - Guia de Uso

## ✅ Configuração Completa

A extração e conversão dos KPIs foi concluída com sucesso! Aqui está o que foi implementado:

### Arquivos Criados

1. **`src/lib/kpi_engine.ts`** - Motor de cálculo dos KPIs em TypeScript
2. **`src/services/azureDataService.ts`** - Serviço para carregar dados do Azure
3. **`src/hooks/useKPIData.ts`** - Hook React para uso nos componentes
4. **`src/components/KPIDashboard.tsx`** - Componente de exemplo pronto para uso
5. **`public/data/itens_completo.json`** - Dados extraídos (9.928 itens)

### Dados Extraídos

- ✅ **9.928 itens** do Azure DevOps
- ✅ Campos customizados mapeados (Prospectar, Análise, Tipo de Solução)
- ✅ Dados salvos em formato JSON acessível pelo frontend

## 🚀 Como Usar

### Opção 1: Usar o Componente Pronto

Adicione o componente `KPIDashboard` em qualquer página:

```tsx
import { KPIDashboard } from '@/components/KPIDashboard';

function MinhaPage() {
  return (
    <div className="container mx-auto p-6">
      <KPIDashboard />
    </div>
  );
}
```

### Opção 2: Usar o Hook Customizado

Para mais controle, use o hook `useKPIData`:

```tsx
import { useKPIData } from '@/hooks/useKPIData';

function MeuComponente() {
  const { kpis, loading, error } = useKPIData({ sprintNum: 36 });

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <h2>Tempo Médio: {kpis?.tempo_medio.valor.toFixed(1)} dias</h2>
      <h2>Cronograma: {kpis?.cronograma.valor.toFixed(1)}%</h2>
    </div>
  );
}
```

### Opção 3: Usar Diretamente as Funções

Para cálculos customizados:

```tsx
import { AzureDataService } from '@/services/azureDataService';
import { prepararDados, calcularKPIs } from '@/lib/kpi_engine';

async function calcularKPIsCustomizados() {
  // 1. Carregar dados
  const dados = await AzureDataService.loadData();
  
  // 2. Filtrar (exemplo: apenas Epics da Sprint 36)
  const filtrados = dados.filter(item => 
    item.type === 'Epic' && item.iteration?.includes('Sprint 36')
  );
  
  // 3. Preparar
  const preparados = prepararDados(filtrados);
  
  // 4. Calcular
  const kpis = calcularKPIs(preparados);
  
  return kpis;
}
```

## 📈 KPIs Disponíveis

### 1. Tempo Médio de Análise
- **Fórmula**: Média da diferença absoluta entre Data Prospectar e Data Análise
- **Unidade**: Dias
- **Uso**: `kpis.tempo_medio.valor`

### 2. Taxa de Implantação
- **Fórmula**: (Implantações / Total de Epics) × 100
- **Classificação**:
  - Verde (> 60%): Foco em Entrega
  - Amarelo (40-60%): Equilíbrio
  - Vermelho (< 40%): Foco em Desenvolvimento
- **Uso**: `kpis.implantacao.valor`, `kpis.implantacao.cor`

### 3. Cumprimento de Cronograma
- **Fórmula**: (Entregas no Prazo / Total Entregues) × 100
- **Classificação**:
  - Verde (≥ 90%): Excelente
  - Amarelo (70-89%): Razoável
  - Vermelho (< 70%): Baixo Cumprimento
- **Uso**: `kpis.cronograma.valor`, `kpis.cronograma.msg`

### 4. Desvio de Escopo
- **Fórmula**: (Itens Não Planejados / Itens Planejados) × 100
- **Classificação**:
  - Verde (≤ 10%): Excelente
  - Amarelo (11-30%): Ajustes Naturais
  - Vermelho (> 30%): Alto Desvio
- **Uso**: `kpis.desvio.valor`, `kpis.desvio.classificacao`

## 🔄 Atualizar Dados

Para atualizar os dados do Azure DevOps:

```bash
cd frontend
node extrator_azure.cjs
```

Isso irá:
1. Conectar ao Azure DevOps usando as credenciais do `.env`
2. Extrair todos os itens desde 2024-01-01
3. Salvar em `../data/itens_completo.json`
4. Copiar automaticamente para `public/data/`

## 🎨 Personalização

### Alterar Calendário de Sprints

Edite `src/lib/kpi_engine.ts`:

```typescript
const SPRINT_CALENDAR: Record<number, string> = {
    37: "2026-03-06",  // Adicione novas sprints
    36: "2026-02-13",
    // ...
};
```

### Adicionar Novos Filtros

No `azureDataService.ts`:

```typescript
static filterByCustomField(items: WorkItem[], field: string, value: string) {
    return items.filter(item => item[field] === value);
}
```

## 🧪 Testes

Os testes unitários estão em `src/lib/kpi_engine.test.ts`.

Para rodar:

```bash
npm test src/lib/kpi_engine.test.ts
```

## 📝 Próximos Passos Sugeridos

1. **Integrar no Dashboard Principal** (`src/pages/Home.tsx`)
2. **Adicionar Gráficos** (usando Recharts)
3. **Criar API Backend** (para não expor dados no frontend)
4. **Implementar Cache** (React Query já está instalado)
5. **Adicionar Exportação** (PDF/Excel dos KPIs)

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
- Verifique se o arquivo `public/data/itens_completo.json` existe
- Certifique-se de que o servidor de desenvolvimento está rodando

### KPIs retornam 0
- Verifique se há dados para a sprint selecionada
- Confirme que os campos customizados estão corretos no extrator

### Erro de CORS
- Se usar API externa, configure CORS no backend
- Para desenvolvimento, use proxy no `vite.config.ts`

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- Código Python original: `kpi_engine.py`
- Documentação de portabilidade: `README_PORTABILIDADE.md`
