# Correção: Usar Banco de Dados para Cálculos

## Problema

O `app.js` ainda está fazendo cálculos de distância e preços localmente usando:
- Objeto `cityCoordinates` incompleto (apenas ~40 cidades)
- Funções `getCityCoordinates()`, `calculateStraightLineDistance()`, `calculateRoadDistance()`
- Funções `getPrice()` para buscar preços do objeto local

**Barretos não está no objeto local**, então o cálculo de distância é impreciso.

## Solução

### 1. Banco de Dados (Já Correto)

A função SQL `criar_cotacao` em `supabase_security_fix_v3.sql` já:
- Busca coordenadas na tabela `cidades` (todas as 647 cidades)
- Calcula distância usando `haversine_distance()` e `road_distance()`
- Verifica limite de 130km
- Busca preços em `pricing_data` ou usa São Paulo + sobretaxa
- Retorna tudo calculado no banco

### 2. JavaScript (Precisa Ser Modificado)

O JavaScript deve ser simplificado para:
- Chamar apenas a função `criar_cotacao` do banco de dados
- Remover todo o cálculo local de distância e preços
- Exibir apenas os resultados retornados pelo banco

## Ações Necessárias

### Passo 1: Verificar Tabela `cidades`

Execute no SQL Editor do Supabase:
```sql
SELECT COUNT(*) as total_cidades FROM cidades;
SELECT * FROM cidades WHERE nome = 'Barretos';
```

Se a tabela não existir ou não tiver Barretos, execute:
```sql
-- Execute o arquivo inserir_cidades_coordenadas.sql
```

### Passo 2: Simplificar `app.js`

A função `callCriarCotacao` já foi criada no arquivo. Ela deve ser usada em vez dos cálculos locais.

**Fluxo correto:**
1. Usuário preenche formulário → `handleQuoteForm`
2. Dados são enviados para função SQL → `criar_cotacao`
3. Banco de dados:
   - Busca coordenadas de `cidades` (Barretos está lá!)
   - Calcula distância real
   - Verifica se > 130km → retorna rejeição
   - Busca preço ou calcula com sobretaxa
   - Retorna preços PB e Colorido calculados
4. JavaScript exibe resultados do banco

## Como Testar

1. Execute o script SQL de inserção das cidades (se ainda não fez)
2. Execute o script `fix_ambiguity.sql` para corrigir função `get_city_coordinates`
3. Teste com Barretos (400km de SP):
   - Deve mostrar mensagem de rejeição
   - Link do WhatsApp deve abrir com dados corretos

## Código da Função `callCriarCotacao`

Esta função já está no `app.js` e deve ser usada:

```javascript
async function callCriarCotacao(eventDate, city, timeOption, numberInput, clientName, clientPhone) {
    // Gera hash
    const hash = generateQuoteHash();

    // Determina action time
    let actionTime;
    let guests = null;

    if (timeOption === 'time') {
        actionTime = parseInt(numberInput);
    } else {
        guests = parseInt(numberInput);
        actionTime = calculateActionTime(guests);
    }

    // Chama função do banco de dados
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/criar_cotacao`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            p_codigo_cotacao: hash,
            p_data_evento: eventDate,
            p_cidade: city,
            p_time_option: timeOption,
            p_action_time: actionTime,
            p_nome: clientName || '',
            p_telefone: clientPhone || '',
            p_quantidade_convidados: guests
        })
    });

    const result = await response.json();

    // Se banco rejeitou (distância > 130), exibe mensagem
    if (result[0] && !result[0].success) {
        return { success: false, message: result[0].message };
    }

    // Sucesso - retorna dados calculados pelo banco
    return {
        success: true,
        hash: hash,
        eventDate: eventDate,
        city: city,
        timeOption: timeOption,
        actionTime: actionTime,
        guests: guests,
        clientName: clientName,
        clientPhone: clientPhone,
        pricePB: result[0].price_pb,
        priceColorido: result[0].price_colorido,
        guestDetails: result[0].guest_details,
        routeDetails: result[0].route_details,
        dateAdjustmentDetails: result[0].date_adjustment_details
    };
}
```

## Resumo

O banco de dados já está correto e calcula tudo. O JavaScript precisa ser simplificado para usar apenas a função do banco, removendo os cálculos locais.
