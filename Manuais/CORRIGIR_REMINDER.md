# CORREÇÕES PARA SISTEMA DE LEMBRETES

## Problemas Identificados

1. **CORS Error**: A Edge Function `send-reminder-frontend` não estava configurada para CORS
2. **Missing OPTIONS handler**: A função não tratava requisições preflight CORS

## Correções Aplicadas

### 1. Edge Function: `supabase/functions/send-reminder-frontend/index.ts`

**Alterações:**
- Adicionado headers CORS em todas as respostas
- Implementado handler para requisições OPTIONS (preflight)
- Adicionado tipagem `any` para tratamento de erros

### 2. SQL: `supabase_reminder_v3.sql`

Novo script com:
- Função `buscar_cotacoes_60_dias()` atualizada
- Políticas RLS recriadas para garantir acesso
- Verificação de instalação

## Como Aplicar as Correções

### Passo 1: Atualizar a Edge Function

1. Abra o dashboard do Supabase
2. Vá em **Edge Functions**
3. Abra a função `send-reminder-frontend`
4. Substitua todo o código pelo conteúdo de:
   `supabase/functions/send-reminder-frontend/index.ts`
5. Clique em **Save** e depois em **Deploy**

### Passo 2: Executar o script SQL no banco

1. Abra o **SQL Editor** do Supabase
2. Abra o arquivo `supabase_reminder_v3.sql`
3. Copie e cole todo o conteúdo
4. Clique em **Run**

### Passo 3: Configurar a API Key do Resend

**IMPORTANTE:** Para enviar emails, você precisa configurar a API Key do Resend:

1. Obtenha uma API Key em: https://resend.com/api-keys
2. No dashboard do Supabase, vá em **Settings** → **Edge Functions**
3. Clique em **Environment Variables**
4. Adicione:
   - Name: `RESEND_API_KEY`
   - Value: `sua_api_key_aqui` (ex: `re_xxxxxxxxxxxxxx`)
5. Clique em **Save**

## Como Testar

1. Abra o `history.html` através de um servidor local
2. Clique no botão "Enviar Lembretes"
3. Se funcionar corretamente, você receberá:
   - Um email com as cotações que têm 60 dias para o evento
   - Uma mensagem de sucesso: "✅ Email enviado com sucesso!"

## Solução de Problemas

### Erro: "API Key do Resend não configurada"

**Causa:** A variável de ambiente RESEND_API_KEY não está configurada no Supabase.

**Solução:** Siga o Passo 3 acima.

### Erro: "Access to fetch... blocked by CORS policy"

**Causa:** A Edge Function não foi atualizada com os headers CORS.

**Solução:** Reimplante a Edge Function seguindo o Passo 1.

### Erro: "Failed to fetch" ou "net::ERR_FAILED"

**Causas possíveis:**
1. Edge Function não foi implantada corretamente
2. Problema de rede
3. URL incorreta do Supabase

**Soluções:**
1. Verifique se a função está ativa no dashboard do Supabase
2. Verifique se a URL está correta no `app.js`
3. Tente novamente em alguns minutos

## Notas Importantes

- As correções garantem que a função aceita requisições de qualquer origem (CORS: *)
- Para produção, considere restringir a origem para apenas seu domínio
- A API Key do Resend deve ser mantida em segredo
- Os emails são enviados para `tattootatua@gmail.com` (configurável na Edge Function)
