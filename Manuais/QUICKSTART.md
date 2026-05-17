# Guia Rápido de Uso - Sistema de Cotação Tatuá

## 🚀 Como Começar

### 1. Testando o Sistema Localmente

**Opção 1 - Abrir diretamente:**
- Dê um duplo clique no arquivo `index.html`
- O sistema abrirá no seu navegador padrão

**Opção 2 - Pelo terminal:**
```bash
cd C:\Users\Administrador\Desktop\CotacaoTatua
start index.html
```

---

## 🎯 Como Fazer uma Cotação

### Passo 1: Preencher o Formulário

1. **Data do Evento:**
   - Clique no campo de data
   - Selecione a data desejada do calendário
   - A data mínima é o dia atual

2. **Cidade:**
   - Clique no dropdown de cidades
   - Selecione a cidade desejada (todas do estado de São Paulo)
   - As cidades estão em ordem alfabética

3. **Tempo de Ação:**
   - Escolha uma das duas opções:
     - **Quantidade de convidados:** O sistema calculará o tempo automaticamente
     - **Tempo de ação (horas):** Você digita o tempo diretamente

4. **Número:**
   - Se escolheu convidados: Digite o número de convidados (ex: 200)
   - Se escolheu tempo: Digite as horas (ex: 4)

5. **Clique em "Calcular Cotação"**

---

## 🔍 Como Funciona o Cálculo

### Baseado em Convidados:
- **Menos de 150 convidados:** Tempo fixo de 2 horas
- **150-210 convidados:** 3 horas
- **211-270 convidados:** 4 horas
- E assim por diante...

### Baseado em Tempo:
- O tempo digitado é usado diretamente

### Preços:
- **Cidades catalogadas:** Preços fixos no sistema
- **Outras cidades:** Preço de São Paulo + sobretaxa por distância
- **Limite de distância:** 130km da Zona Sul de São Paulo

---

## 📊 Visualizando a Cotação

Após o cálculo, você verá:

### Informações Básicas:
- Código único da cotação
- Data do evento escolhida
- Cidade selecionada
- Tempo de ação calculado
- Detalhes de convidados (se aplicável)

### Opções de Preço:
- **Preto e Branco:** Valor total e valor por extenso
- **Colorido:** Valor total e valor por extenso

### Ações Disponíveis:
- **Download PDF:** Baixa documento formatado
- **Contratar via WhatsApp:** Abre WhatsApp com mensagem pré-formatada
- **Nova Cotação:** Retorna ao formulário inicial

---

## 📱 Ações Pós-Cotação

### Download PDF:
1. Clique em "Download PDF"
2. O arquivo será baixado com formato `cotacao_TAT-XXXXXX.html`
3. Abra no navegador para visualizar

### Contratar via WhatsApp:
1. Clique em "Contratar via WhatsApp"
2. Será aberto o WhatsApp Web ou app
3. A mensagem já estará pronta com todos os dados
4. Basta clicar em enviar

---

## 📋 Histórico de Cotações

### Acessar Histórico:
1. Na página principal, clique em "Histórico" (canto superior direito)
2. Serão mostradas todas as cotações realizadas neste dispositivo

### Informações no Histórico:
- Código da cotação
- Data e hora da solicitação
- Detalhes completos de cada cotação
- Preços calculados

### Limpar Histórico:
- Clique em "Limpar Histórico"
- Confirme a exclusão
- Todas as cotações serão removidas

---

## 🎨 Testando Diferentes Cenários

### Teste 1 - Cidade Catalogada:
- Cidade: São Paulo
- Convidados: 200
- **Resultado esperado:** Preços exatos do banco de dados

### Teste 2 - Cidade Não Catalogada (próxima):
- Cidade: Campinas
- Tempo: 4 horas
- **Resultado esperado:** Preço de SP + sobretaxa por distância

### Teste 3 - Cidade Distante:
- Cidade: Escolha uma cidade mais distante
- **Resultado esperado:** Cotação recusada (>130km)

### Teste 4 - Poucos Convidados:
- Convidados: 100
- **Resultado esperado:** Tempo fixo de 2 horas

### Teste 5 - Muitos Convidados:
- Convidados: 300
- **Resultado esperado:** Tempo calculado (4-5 horas)

---

## 🛠️ Troubleshooting

### Problema: Cotação não calcula
**Solução:** Verifique se todos os campos estão preenchidos

### Problema: WhatsApp não abre
**Solução:** Verifique sua conexão de internet

### Problema: PDF não baixa
**Solução:** Verifique se o navegador permite downloads

### Problema: Cidade muito distante
**Solução:** Isso é normal - o sistema rejeita cidades >130km

---

## 📞 Contato para Suporte

### WhatsApp:
- **Número:** (13) 99784-8897
- **Horário:** Segunda a Sexta, 9h às 18h

### Email:
- **Assunto:** Dúvida Sistema de Cotação
- **Descrição:** Explique seu problema em detalhes

---

## 💡 Dicas Úteis

### Para Clientes:
- Tenha em mente a data do evento antes de começar
- Estime o número de convidados com precisão
- Considere se prefere tatuagens preto e branco ou coloridas

### Para o Proprietário:
- Atualize os preços regularmente no arquivo `pricing.csv`
- Adicione novas cidades conforme necessário
- Monitore as cotações para entender o mercado

---

## 🎓 Próximos Passos

### Após Testar Localmente:
1. ✅ Verifique se todas as funcionalidades funcionam
2. ✅ Teste em diferentes navegadores
3. ✅ Teste em dispositivos móveis
4. ✅ Faça cotações de teste
5. ✅ Verifique o WhatsApp integration

### Quando Estiver Pronto:
1. Escolha uma plataforma de hosting (ver DEPLOYMENT.md)
2. Publique o site na internet
3. Divulgue o link para clientes
4. Monitore as cotações recebidas

---

## 🚀 Comandos Rápidos

### Abrir o sistema:
```bash
cd C:\Users\Administrador\Desktop\CotacaoTatua
start index.html
```

### Ver arquivos do projeto:
```bash
cd C:\Users\Administrador\Desktop\CotacaoTatua
ls -la
```

### Editar preços:
```bash
cd C:\Users\Administrador\Desktop\CotacaoTatua
notepad pricing.csv
```

---

## 📱 QR Code para Acesso Rápido

Após publicar o site, você pode criar um QR code para compartilhar facilmente:
1. Use um gerador de QR code online
2. Cole o URL do seu site publicado
3. Baixe a imagem do QR code
4. Imprima ou compartilhe digitalmente

---

## 🎉 Você Está Pronto!

Agora você pode:
- ✅ Fazer cotações automaticamente
- ✅ Oferecer preços consistentes
- ✅ Gerenciar histórico de clientes
- ✅ Integrar com WhatsApp
- ✅ Gerar documentos profissionais

**Boas vendas com seu sistema de cotação de tatuagens temporárias!** 🎨✨

---

**Desenvolvido com ❤️ para Tatuá**