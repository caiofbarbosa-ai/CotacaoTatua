# Configurar Cron para send-reminder-frontend

O Supabase mudou recentemente a forma de configurar cron. Agora precisa ser feito via CLI.

## Pré-requisitos

1. Instale o Node.js se ainda não tiver: https://nodejs.org/
2. Instale o Supabase CLI:
   ```bash
   npm install -g supabase
   ```

## Passo a Passo

### 1. Faça Login no Supabase

Abra o terminal (PowerShell ou CMD) e execute:
```bash
supabase login
```

Isso abrirá uma janela do navegador para fazer login na sua conta do Supabase.

### 2. Navegue até o diretório do projeto

```bash
cd C:\Users\Administrador\desktop\cotacaotatua
```

### 3. Deploy da Função com Cron

Execute o comando:
```bash
supabase functions deploy send-reminder-frontend --project-ref spunhqjwlooktyvrleef --no-verify-jwt
```

### 4. Verificar se Funcionou

Acesse: https://supabase.com/dashboard/project/spunhqjwlooktyvrleef/functions

Você deve ver a função `send-reminder-frontend` listada.

## Testar o Cron Manualmente

Para testar a função imediatamente (sem esperar até 9h):

1. **Via navegador:**
   - Acesse: https://spunhqjwlooktyvrleef.supabase.co/functions/v1/send-reminder-frontend
   - Isso deve retornar um erro porque precisa ser POST, mas confirma que a função está ativa

2. **Via curl (PowerShell):**
   ```powershell
   $body = @{ html = "<h1>Teste</h1>"; subject = "Teste" } | ConvertTo-Json
   Invoke-RestMethod -Uri "https://spunhqjwlooktyvrleef.supabase.co/functions/v1/send-reminder-frontend" -Method Post -Body $body -ContentType "application/json"
   ```

## Ver Logs de Execução

1. Acesse: https://supabase.com/dashboard/project/spunhqjwlooktyvrleef/logs
2. Em "Application", selecione "Edge Functions"
3. Você verá os logs de cada execução do cron

## Alternativa: Serviço de Cron Externo (GitHub Actions)

Se não conseguir usar o Supabase CLI, você pode usar GitHub Actions:

### 1. Crie um arquivo `.github/workflows/reminder-cron.yml`

```yaml
name: Lembretes de Cotações

on:
  schedule:
    - cron: '0 9 * * *'  # Todos os dias às 9h (UTC)
  workflow_dispatch:  # Permite executar manualmente

jobs:
  reminder:
    runs-on: ubuntu-latest
    steps:
      - name: Enviar Lembretes
        run: |
          curl -X POST https://spunhqjwlooktyvrleef.supabase.co/functions/v1/send-reminder-frontend \
            -H "Content-Type: application/json" \
            -d '{"html":"<h1>Teste via GitHub Actions</h1>","subject":"Teste Cron"}'
```

### 2. Fazer push para o GitHub

Este arquivo deve estar no seu repositório GitHub. Quando você fizer push, o GitHub Actions será criado automaticamente.

## Problemas Comuns

### Erro: "supabase não é reconhecido"

**Solução:**
```bash
npm install -g supabase
# Feche e abra o terminal novamente
```

### Erro: "Project not found"

**Solução:** Verifique se o project ID está correto no `config.toml`

### Erro: "Function not found"

**Solução:**
- Verifique se o arquivo existe: `supabase/functions/send-reminder-frontend/index.ts`
- Verifique se o nome está correto

## Horário do Cron

O horário configurado (`0 9 * * *`) está em UTC. Para ajustar para o fuso horário de São Paulo (UTC-3):

- **9h UTC** = **6h horário de São Paulo**
- **12h UTC** = **9h horário de São Paulo**

Se quiser que execute às 9h de São Paulo, use:
```toml
schedule = "0 12 * * *"
```

Ou verifique o fuso horário do seu projeto no Supabase.
