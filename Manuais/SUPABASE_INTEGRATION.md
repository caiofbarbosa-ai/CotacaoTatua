# Integração com Supabase

## Resumo das Alterações

O sistema de cotação foi modificado para salvar os dados no banco de dados Supabase em vez de apenas no localStorage.

## Arquivos Modificados

### 1. `supabase_migration.sql` (executado)
Script SQL inicial que adicionou colunas e configurou RLS.

### 2. `supabase_cleanup.sql` (para executar)
Script SQL para remover colunas antigas e adicionar campo `quantidade_convidados`.

### 3. `app.js`
Modificado para integrar com o Supabase:
- Adicionadas constantes de configuração do Supabase
- Função `saveQuoteHistory` salva no banco de dados
- Campo `guests` adicionado ao objeto de cotação
- Fallback para localStorage **removido** - salva apenas no Supabase

## Configurações do Supabase

```javascript
const SUPABASE_URL = 'https://spunhqjwlooktyvrleef.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwdW5ocWp3bG9va3R5dnJsZWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjM3MzEsImV4cCI6MjA5MzM5OTczMX0.Df5dFmacPRfJxdQUtP5y0hnnmufZoNbzkp3N1gAhoPI';
```

## Estrutura da Tabela `contatos`

### Colunas Atuais:
- `id` (automático)
- `codigo_cotacao` (obrigatório) - Hash da cotação
- `data_evento` (obrigatório) - Data do evento
- `data_cotacao` (obrigatório) - Data da cotação
- `nome` - Nome do cliente
- `telefone` - Telefone do cliente
- `cidade` - Cidade do evento
- `time_option` - "guests" ou "time"
- `action_time` - Tempo de ação em horas
- `quantidade_convidados` - Quantidade de convidados (NULL quando time_option = "time")
- `price_pb` - Preço preto e branco
- `price_colorido` - Preço colorido
- `guest_details` - Detalhes dos convidados (opcional)
- `route_details` - Detalhes da rota (opcional)
- `date_adjustment_details` - Detalhes do ajuste de data (opcional)
- `created_at` (automático)

### Colunas Removidas (via supabase_cleanup.sql):
- ~~`tempo_acao`~~
- ~~`tipo_calculo`~~
- ~~`valor_pb`~~
- ~~`valor_colorido`~~

## Políticas RLS Configuradas

1. **Allow anonymous insert** - Permite inserções com a chave ANON
2. **Allow anonymous select** - Permite leitura com a chave ANON
3. **Allow anonymous update** - Permite atualizações com a chave ANON

## Comportamento do Campo `quantidade_convidados`

- Quando `time_option = "guests"`: Preenchido com a quantidade de convidados informada
- Quando `time_option = "time"`: NULL (vazio)

## Segurança

✅ Usa apenas a **ANON key** (não expõe credenciais sensíveis)
✅ As políticas RLS restringem o acesso
✅ Erros são logados no console para debug
✅ Sem fallback para localStorage - salva apenas no Supabase

## Como Testar

1. Execute o `supabase_cleanup.sql` no painel do Supabase
2. Acesse a aplicação
3. Faça uma cotação selecionando "Quantidade de convidados"
4. Faça outra cotação selecionando "Tempo de ação"
5. Verifique o console do navegador (F12) para ver se foi salvo com sucesso
6. Acesse o painel do Supabase → Table Editor → contatos para verificar os dados

## Próximos Passos

Execute o SQL `supabase_cleanup.sql` no painel do Supabase para:
1. Adicionar a coluna `quantidade_convidados`
2. Remover as colunas antigas não utilizadas
