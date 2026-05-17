# Configuração de Lembretes de Cotações

## 📋 Visão Geral

O sistema agora inclui funcionalidade para enviar lembretes automáticos por email quando faltam 60 dias para o evento de uma cotação.

## 🚀 Funcionalidades

1. **Envio Manual** - Botão na página de histórico para executar esporadicamente
2. **Envio Automático (Cron)** - Execução diária automática via Supabase Edge Function
3. **Email Formatado** - HTML profissional com links diretos para WhatsApp

## 📝 Configuração

### Passo 1: Configurar Resend (Serviço de Email)

1. Acesse: https://resend.com/
2. Crie uma conta gratuita
3. Vá em: API Keys → Create API Key
4. Copie a API Key (começa com `re_`)

### Passo 2: Configurar API Key

#### Para uso manual (app.js):
No arquivo `app.js`, localize a linha:
```javascript
const RESEND_API_KEY = 're_YOUR_API_KEY_HERE';
```
Substitua pela sua API Key.

#### Para uso automático (Edge Function):
No painel do Supabase:
1. Vá em: Project Settings → Edge Functions
2. Em "Environment Variables", adicione:
   - Name: `RESEND_API_KEY`
   - Value: `re_sua_api_key_aqui`

### Passo 3: Executar o SQL no Supabase

Execute o arquivo `supabase_reminder.sql` no painel do Supabase:
https://supabase.com/dashboard/project/spunhqjwlooktyvrleef/sql/new

Isso criará as funções necessárias para buscar as cotações com 60 dias.

### Passo 4: Deploy da Edge Function (Para Cron Automático)

#### Opção A: Via Supabase CLI (Recomendado)

1. Instale o Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Faça login no Supabase:
   ```bash
   supabase login
   ```

3. Deploy da função:
   ```bash
   cd C:\Users\Administrador\Desktop\CotacaoTatua
   supabase functions deploy send-reminder
   ```

#### Opção B: Via Dashboard do Supabase

1. Acesse: https://supabase.com/dashboard/project/spunhqjwlooktyvrleef/functions/new
2. Nome da função: `send-reminder`
3. Copie o conteúdo de: `supabase/functions/send-reminder/index.ts`
4. Cole no editor
5. Clique em "Deploy"

### Passo 5: Configurar o Cron no Dashboard

1. Acesse: https://supabase.com/dashboard/project/spunhqjwlooktyvrleef/functions
2. Encontre a função `send-reminder`
3. Clique em "Settings"
4. Em "Cron Schedule", adicione:
   - Schedule: `0 9 * * *` (diariamente às 9h)
5. Clique em "Save"

## 🧪 Testando o Sistema

### Teste Manual (Página History)

1. Abra a página `history.html` no navegador
2. Clique no botão "📧 Enviar Lembretes (60 dias)"
3. O sistema buscará as cotações e enviará o email

### Teste Manual (Edge Function)

Via curl:
```bash
curl -X POST https://spunhqjwlooktyvrleef.supabase.co/functions/v1/send-reminder \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwdW5ocWp3bG9va3R5dnJsZWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjM3MzEsImV4cCI6MjA5MzM5OTczMX0.Df5dFmacPRfJxdQUtP5y0hnnmufZoNbzkp3N1gAhoPI"
```

Ou acesse diretamente no navegador:
https://spunhqjwlooktyvrleef.supabase.co/functions/v1/send-reminder

### Teste com Dados de Exemplo

Para testar, insira uma cotação com data de evento exatamente 60 dias no futuro:

```sql
INSERT INTO contatos (
    codigo_cotacao,
    data_evento,
    data_cotacao,
    nome,
    telefone,
    cidade,
    time_option,
    action_time,
    quantidade_convidados,
    price_pb,
    price_colorido
) VALUES (
    'TEST-60-DIAS-' || generate_series(1,3),
    CURRENT_DATE + INTERVAL '60 days',
    NOW(),
    'Cliente Teste 60 Dias',
    '13997848897',
    'Santos',
    'guests',
    4,
    200,
    2600,
    2900
);
```

## 📧 Como Funciona

### Fluxo do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Função SQL: buscar_cotacoes_60_dias()                   │
│    └─> Busca cotações onde data_evento está a 60 dias      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Execução (Manual ou Cron)                               │
│    ├─> Manual: Botão em history.html                       │
│    └─> Cron: Edge Function agendada                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Processamento                                           │
│    ├─> Chama a função SQL                                  │
│    ├─> Formata o email HTML                                │
│    └─> Envia via Resend API                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Email Enviado                                           │
│    ├─> Para: tattootatua@gmail.com                        │
│    ├─> Assunto: Lembretes de Cotações - [data]            │
│    ├─> Corpo: Lista de cotações                           │
│    └─> Cada item tem link para WhatsApp                   │
└─────────────────────────────────────────────────────────────┘
```

### Mensagem do WhatsApp

```
Olá, falta apenas 2 meses para seu evento. Vamos deixa-lo marcado na pele dos seus convidados para sempre (ou até o próximo banho)?
```

## 📊 Estrutura do Email

O email enviado contém:

- **Header:** Título e data
- **Lista de Cotações:**
  - Código da cotação
  - Nome e telefone do cliente
  - Cidade e data do evento
  - Tempo de ação
  - Preços (PB e Colorido)
  - **Botão:** Contatar no WhatsApp (com mensagem pré-definida)
- **Footer:** Informações do sistema

## 🔍 Debug e Troubleshooting

### Erro: "Atualização necessária!"

Causa: A API Key do Resend não foi configurada.

Solução:
1. Obtenha uma API Key em https://resend.com/api-keys
2. Para uso manual: atualize `RESEND_API_KEY` no `app.js`
3. Para uso automático: configure como Environment Variable no Supabase

### Erro: "Nenhuma cotação encontrada"

Causa: Não há cotações com exatamente 60 dias para o evento.

Solução:
- O sistema busca cotas onde a data do evento está entre 59 e 61 dias da data atual
- Verifique se há cotações com datas de evento dentro desse período

### Erro: "Erro ao enviar email"

Causas possíveis:
- API Key inválida
- Domínio não verificado no Resend
- Problema de conexão

Solução:
1. Verifique a API Key
2. No painel do Resend, verifique se o domínio está confirmado
3. Verifique os logs do console ou Edge Function

### Verificar Logs da Edge Function

1. Acesse: https://supabase.com/dashboard/project/spunhqjwlooktyvrleef/functions
2. Clique na função `send-reminder`
3. Vá em "Logs" para ver detalhes de execução

## 🔐 Segurança

- A API Key do Resend está configurada como Environment Variable na Edge Function (mais seguro)
- A função não requer autenticação (verify_jwt = false) para facilitar o acesso via cron
- Para maior segurança, considere implementar autenticação se necessário

## 📁 Arquivos Envolvidos

```
CotacaoTatua/
├── app.js                              # Funções de lembrete (uso manual)
├── history.html                        # Página com botão de lembrete
├── supabase_reminder.sql              # SQL: criar funções de busca
├── supabase/
│   ├── config.toml                    # Configuração do Supabase CLI
│   └── functions/
│       └── send-reminder/
│           ├── index.ts              # Edge Function para cron automático
│           └── deno.json             # Configuração do Deno
└── REMINDER_SETUP.md                  # Este arquivo
```

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Verifique o console do navegador (F12) para logs de erro (uso manual)
2. Verifique os logs da Edge Function no Dashboard do Supabase (uso automático)
3. Verifique os logs do Resend: https://resend.com/dashboard/logs
4. Verifique as funções SQL no Supabase: https://supabase.com/dashboard/project/spunhqjwlooktyvrleef/database/functions

## ✅ Checklist de Configuração

- [ ] Obter API Key do Resend
- [ ] Executar `supabase_reminder.sql` no Supabase
- [ ] Configurar `RESEND_API_KEY` no app.js (uso manual)
- [ ] Configurar `RESEND_API_KEY` como Environment Variable (uso automático)
- [ ] Deploy da Edge Function `send-reminder`
- [ ] Configurar cron schedule na Edge Function (0 9 * * *)
- [ ] Testar envio manual via history.html
- [ ] Testar envio manual via URL da Edge Function
- [ ] Verificar email recebido em tattootatua@gmail.com
