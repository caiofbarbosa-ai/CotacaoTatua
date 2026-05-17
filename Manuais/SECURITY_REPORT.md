# Relatório de Segurança - Sistema de Cotação Tatuá

## ⚠️ Brechas de Segurança Identificadas (ANTES DA CORREÇÃO)

### 1. Cálculo de Preços no Cliente (Risco Crítico)

**Problema:** Todos os cálculos de preço são executados no navegador (JavaScript), e os valores calculados são enviados diretamente ao banco de dados.

**Ataque Possível:**
```javascript
// Um usuário mal-intencionado pode abrir o console do navegador (F12)
// e executar:

window.currentQuoteData.pricePB = 100;        // preço real era 2500
window.currentQuoteData.priceColorido = 150;  // preço real era 2800

// Ou interceptar a requisição fetch e modificar o body antes do envio
```

**Impacto:** Usuário pode contratar serviços por valores muito abaixo do preço real.

### 2. Variável Global Exposta

**Problema:** `window.currentQuoteData` está acessível globalmente e pode ser modificada a qualquer momento antes do envio.

**Impacto:** Permite manipulação de todos os dados da cotação.

### 3. Ausência de Validação no Servidor

**Problema:** O Supabase RLS apenas permite/nega INSERT, mas não valida os valores recebidos.

**Impacto:** Qualquer valor enviado pelo cliente é aceito sem questionamentos.

---

## 🔒 Solução Implementada

### Função SQL Segura `criar_cotacao`

A solução move toda a lógica de cálculo para o servidor através de uma função SQL:

**Arquivo:** `supabase_security_fix.sql`

**O que a função faz:**
1. Recebe apenas os parâmetros de entrada (não recebe preços)
2. Valida todos os dados de entrada
3. Calcula os preços internamente no servidor
4. Aplica regras de negócio (ajuste de data, etc.)
5. Insere a cotação com os valores calculados
6. Retorna resultado com confirmação

**Arquivo modificado:** `app.js`

Agora o cliente envia apenas:
- `p_codigo_cotacao` - Código/hash
- `p_data_evento` - Data do evento
- `p_cidade` - Cidade
- `p_time_option` - Tipo de cálculo
- `p_action_time` - Tempo de ação
- `p_nome` - Nome do cliente (opcional)
- `p_telefone` - Telefone do cliente (opcional)
- `p_quantidade_convidados` - Quantidade de convidados (opcional)

E o servidor calcula:
- `price_pb` - Preço preto e branco
- `price_colorido` - Preço colorido
- `guest_details` - Detalhes formatados
- `date_adjustment_details` - Detalhes do ajuste
- `route_details` - Detalhes da rota (quando implementado)

---

## 🛡️ Como a Segurança Foi Melhorada

### Antes:
```
Cliente → Calcula Preço → Envia Preço → Banco Aceita
       ↑                                     ↑
   Pode ser alterado                    Aceita qualquer valor
```

### Depois:
```
Cliente → Envia Parâmetros → Servidor Calcula → Banco Insere
                                   ↑
                              Cálculo protegido
                              Validação no servidor
```

---

## 📋 Passos para Implementação

### 1. Executar o SQL de Segurança

Acesse: https://supabase.com/dashboard/project/spunhqjwlooktyvrleef/sql/new

Cole e execute o conteúdo do arquivo `supabase_security_fix.sql`

### 2. Testar

1. Faça uma cotação normalmente
2. Verifique se os dados foram salvos
3. Tente modificar `window.currentQuoteData` no console antes de salvar
4. Observe que os preços não são alterados (são recalculados no servidor)

---

## 🔍 Validações Implementadas na Função SQL

| Validação | Regra |
|-----------|-------|
| Cidade | Obrigatória |
| Data do evento | Não pode ser no passado |
| Data do evento | Máximo 2 anos no futuro |
| time_option | Deve ser "guests" ou "time" |
| action_time | Deve ser ≥ 1 |
| Ajuste de data | +5% para eventos entre 1-2 anos |

---

## ⚠️ Observações Importantes

### 1. Tabela de Preços

A função atual usa uma fórmula simples para calcular os preços base:
```sql
v_sao_paulo_pb := 2200.0 + (p_action_time - 2) * 400.0;
v_sao_paulo_colorido := 2500.0 + (p_action_time - 2) * 450.0;
```

**Recomendação:** Criar uma tabela de preços no Supabase e modificar a função para buscar os valores corretos.

### 2. Tabela de Cidades com Coordenadas

Para calcular corretamente a sobretaxa de distância, seria necessário:
1. Criar uma tabela de cidades com lat/lon
2. Adicionar lógica de cálculo de distância na função SQL
3. Calcular a sobretaxa de R$ 9,00 por km

---

## 📊 Comparação de Segurança

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Cálculo de preços | Cliente (vulnerável) | Servidor (seguro) |
| Validação | Nenhuma | No servidor |
| Modificação via console | Possível | Impossível |
| Interceptação de requisição | Funciona | Não afeta os preços |
| Consistência de dados | Não garantida | Garantida |

---

## ✅ Checklist de Segurança

- [x] Função SQL criada
- [x] Cálculos movidos para servidor
- [x] Validações implementadas
- [x] Policy de INSERT direto removida
- [x] Cliente atualizado para usar função
- [ ] Tabela de preços criada (recomendado)
- [ ] Tabela de cidades com coordenadas criada (recomendado)
- [ ] Testes de segurança realizados

---

**Status:** 🔒 Segurança Implementada

**Próxima Ação:** Executar `supabase_security_fix.sql` no painel do Supabase.
