const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

// --- SUAS CONFIGURAÇÕES ---
const org = process.env.AZURE_ORG_URL || 'https://dev.azure.com/suaorg';
const project = process.env.AZURE_PROJECT || 'SeuProjeto';
const token = process.env.AZURE_PAT;

if (!token) {
    console.error("❌ Erro: Token AZURE_PAT não encontrado no arquivo .env");
    process.exit(1);
}

const auth = 'Basic ' + Buffer.from(':' + token).toString('base64');

// O NOME DO SEU CAMPO PERSONALIZADO
const CAMPO_TIPO_SOLUCAO = "Custom.498a9288-7c85-4800-800d-2ed5b011eefd";
const CAMPO_PROSPECTAR = "Custom.d583d2dc-0ad4-47a8-b36e-14c73ce0bb26";
const CAMPO_ANALISE = "Custom.53fe01b9-fe2d-4e69-9cb7-a53b6e748c0e";

async function runWiqlQuery(query) {
    const res = await fetch(`${org}/${encodeURIComponent(project)}/_apis/wit/wiql?api-version=7.0`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: auth },
        body: JSON.stringify({ query }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || `WIQL HTTP ${res.status}`);
    return data;
}

async function getWorkItemsBatch(ids) {
    const idsStr = ids.join(',');
    const fields = [
        "System.Id", "System.Title", "System.State", "System.WorkItemType",
        "System.IterationPath", "System.CreatedDate",
        "Microsoft.VSTS.Common.ActivatedDate", "Microsoft.VSTS.Common.ClosedDate",
        CAMPO_TIPO_SOLUCAO,
        CAMPO_PROSPECTAR,
        CAMPO_ANALISE
    ].join(',');

    const url = `${org}/${encodeURIComponent(project)}/_apis/wit/workitems?ids=${idsStr}&fields=${fields}&api-version=7.0`;
    const res = await fetch(url, { headers: { Authorization: auth } });
    const data = await res.json();
    return data.value;
}

async function main() {
    console.log("🚀 Extraindo dados (Com filtro de Epic e Tipo de Solução)...");

    // AJUSTE A QUERY CONFORME NECESSÁRIO
    const query = "SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = '" + project + "' AND [System.CreatedDate] >= '2024-01-01T00:00:00Z'";

    const wiql = await runWiqlQuery(query);
    const ids = (wiql.workItems || []).map((w) => w.id);
    console.log(`Total de itens encontrados: ${ids.length}`);

    let results = [];
    const BATCH_SIZE = 200;

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const chunk = ids.slice(i, i + BATCH_SIZE);
        try {
            const items = await getWorkItemsBatch(chunk);
            items.forEach(item => {
                if (item && item.fields) {
                    results.push({
                        id: item.id,
                        title: item.fields['System.Title'],
                        state: item.fields['System.State'],
                        type: item.fields['System.WorkItemType'], // Ex: Epic
                        // Mapeamos o campo feio para um nome bonito 'tipoSolucao'
                        tipoSolucao: item.fields[CAMPO_TIPO_SOLUCAO],
                        iteration: item.fields['System.IterationPath'],
                        createdDate: item.fields['System.CreatedDate'],
                        activatedDate: item.fields['Microsoft.VSTS.Common.ActivatedDate'],
                        closedDate: item.fields['Microsoft.VSTS.Common.ClosedDate'],
                        [CAMPO_PROSPECTAR]: item.fields[CAMPO_PROSPECTAR],
                        [CAMPO_ANALISE]: item.fields[CAMPO_ANALISE]
                    });
                }
            });
            console.log(`Processados ${Math.min(i + BATCH_SIZE, ids.length)}...`);
        } catch (err) { console.log(`Erro lote ${i}: ${err.message}`); }
    }
    const caminhoFinal = path.join(__dirname, '../data/itens_completo.json');

    // Garante que a pasta data existe
    if (!fs.existsSync(path.dirname(caminhoFinal))) {
        fs.mkdirSync(path.dirname(caminhoFinal));
    }

    fs.writeFileSync(caminhoFinal, JSON.stringify(results, null, 2));
    console.log(`Salvo em: ${caminhoFinal}`);
}

main().catch(console.error);
